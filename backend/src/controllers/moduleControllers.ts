import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import * as moduleService from "../services/moduleServices";
import { handleError } from "../utils/errorHandler";

export const handleGetModulesByCourse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const data = await moduleService.getModulesByCourse(Number(courseId));
    return res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res)
  }
};

export const handleCreateModule = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { course_id, title, module_order } = req.body;
    const data = await moduleService.createModule(Number(course_id), title, Number(module_order));
    return res.status(201).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res)
  }
};

export const handleUpdateModule = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, module_order } = req.body;
    const data = await moduleService.updateModule(Number(id), title, Number(module_order));
    return res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res)
  }
};

export const handleDeleteModule = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await moduleService.removeModule(Number(id));
    return res.status(200).json({ success: true, message: "Module successfully deleted" });
  } catch (err: unknown) {
    handleError(err, res)
  }
};

export const getCourseSyllabus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { courseId } = req.params;    
    const modules = await moduleService.getSyllabusModules(Number(courseId));
    res.status(200).json({ courseId, modules });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch syllabus data" });
  }
};