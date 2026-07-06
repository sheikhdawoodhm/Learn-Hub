import { Response } from "express";
import { ProgressService } from "../services/progressServices";


export const syncProgress = async (req: any, res: Response) => {
  const { courseId, moduleId, videoId, lectureKey } = req.body;
  const userId = req.user.id; 

  try {
    const message = await ProgressService.saveProgressRecord(userId, courseId, moduleId, videoId, lectureKey);
    res.status(200).json({ success: true, message });
  } catch (error: any) {
    console.error("Progress Controller Error:", error.message);
    res.status(500).json({ error: error.message || "Failed to persist progress milestone." });
  }
};

export const getUserProgressHistory = async (req: any, res: Response) => {
  const userId = req.user.id;
  try {
    const completedLectures = await ProgressService.fetchProgressKeysForUser(userId);
    res.status(200).json({ completedLectures });
  } catch (error: any) {
    console.error("Progress History Controller Error:", error.message);
    res.status(500).json({ error: "Could not fetch tracking record logs." });
  }
};



