import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import * as quizService from "../services/quizServices";
import { handleError } from "../utils/errorHandler";

export const handleGetQuizByVideo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { videoId } = req.params;
    const data = await quizService.getFullQuizByVideo(Number(videoId));
    return res.status(200).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res)
  }
};

export const handleCreateQuiz = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { video_id, title } = req.body;
    const data = await quizService.createQuiz(Number(video_id), title);
    return res.status(201).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res)
  }
};

export const handleAddQuestion = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { quiz_id, question_text } = req.body;
    const data = await quizService.addQuestionToQuiz(Number(quiz_id), question_text);
    return res.status(201).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res)
  }
};

export const handleAddOption = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { question_id, option_text, is_correct } = req.body;
    const data = await quizService.addOptionToQuestion(Number(question_id), option_text, Boolean(is_correct));
    return res.status(201).json({ success: true, data });
  } catch (err: unknown) {
    handleError(err, res)
  }
};

export const handleDeleteQuiz = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await quizService.removeQuiz(Number(id));
    return res.status(200).json({ success: true, message: "Quiz successfully deleted" });
  } catch (err: unknown) {
    handleError(err, res)
  }
};