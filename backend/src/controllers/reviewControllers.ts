import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import * as reviewService from "../services/reviewServices";
import { handleError } from "../utils/errorHandler";

export const handleGetReviews = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const data = await reviewService.getCourseReviews(Number(courseId));
    return res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res)
  }
};

export const handleCreateReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { course_id, comment_text, rating } = req.body;

    const data = await reviewService.addReviewComponents(
      userId,
      Number(course_id),
      comment_text,
      rating ? Number(rating) : undefined
    );

    return res.status(201).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res)
  }
};

export const handleDeleteComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await reviewService.deleteComment(Number(id));
    return res.status(200).json({ success: true, message: "Comment deleted successfully." });
  } catch (err: unknown) {
    handleError(err, res);
  }
};