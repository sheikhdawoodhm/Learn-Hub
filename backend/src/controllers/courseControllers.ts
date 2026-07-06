import { Response, NextFunction } from "express";

import { AuthenticatedRequest } from "../middleware/authMiddleware"; 
import { CreateCourseInput, SaveModulesInput } from "../validationRules/courseValidationRule";
import * as courseServices from "../services/courseServices";

export const initCourseShell = async (
  req: AuthenticatedRequest, 
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const inputData = req.body as CreateCourseInput;
    const courseRecord = await courseServices.createDraftCourse(inputData);
    res.status(201).json(courseRecord);
  } catch (error) {
    next(error); 
  }
};

export const compileCourseModules = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { courseId } = req.params as { courseId: string };
    const { modules } = req.body as SaveModulesInput;
    await courseServices.saveNestedModulesTree({ modules }, courseId);
    
    res.status(201).json({
      success: true,
      message: "Course content tree successfully compiled and deployed live.",
    });
  } catch (error) {
    next(error);
  }
};

export const getCoursesOverview = async (
  req: AuthenticatedRequest, 
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 6;
    

    const userId = req.user?.id; 

    const search = (req.query.search as string) || "";
    const category = (req.query.category as string) || "";
    const status = (req.query.status as string) || ""; 


    const result = await courseServices.fetchPublishedCourses({ 
      page, 
      limit, 
      search, 
      category, 
      status, 
    }, userId!
  );
    
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};