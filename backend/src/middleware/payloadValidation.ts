import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validatePayload = (schema: z.ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsedData = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })) as { body: any; query: any; params: any };

      req.body = parsedData.body;
      
      if (parsedData.query) {
        Object.assign(req.query, parsedData.query);
      }
      
      if (parsedData.params) {
        Object.assign(req.params, parsedData.params);
      }
      
      return next();
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,   
            errors: error.issues.map((err) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        });
        return;
      }
      return next(error);
    }
  };
};