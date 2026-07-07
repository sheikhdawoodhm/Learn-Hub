import { NextFunction, Response } from "express";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
       res.status(403).json({ error: "Access Denied: Insufficient permissions." });
       return;
    }
    next(); 
  };
};