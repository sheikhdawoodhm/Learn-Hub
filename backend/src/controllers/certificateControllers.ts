import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import * as certificateService from "../services/certificateServices";
import { handleError } from "../utils/errorHandler";

export const handleGetCertificate = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { courseId } = req.params;
    const certificate = await certificateService.getCertificate(userId, Number(courseId));
    if (!certificate) {
      return res.status(404).json({ success: false, message: "Certificate not found." });
    }
    return res.status(200).json({ success: true, data: certificate });
  } catch (err: unknown) {
    handleError(err, res);
  }
};

export const handleGenerateCertificate = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { courseId } = req.params;
    const certificate = await certificateService.generateCertificate(userId, Number(courseId));
    return res.status(201).json({ success: true, data: certificate });
  } catch (err: unknown) {
    if (err instanceof Error && err.message === "Course not completed yet.") {
      return res.status(400).json({ success: false, error: err.message });
    }
    handleError(err, res);
  }
};
