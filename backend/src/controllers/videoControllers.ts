import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/authMiddleware";
import * as videoService from "../services/videoServices";
import { handleError } from "../utils/errorHandler";

export const handleGetVideosByModule = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { moduleId } = req.params;
    const data = await videoService.getVideosByModule(Number(moduleId));
    return res.status(200).json({ success: true, data });
  } catch(err : unknown) {
      handleError(err,res)  
    }
};

export const handleCreateVideo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { module_id, title, video_url, video_order } = req.body;
    const data = await videoService.createVideo(Number(module_id), title, video_url, Number(video_order));
    return res.status(201).json({ success: true, data });
  } catch(err : unknown) {
      handleError(err,res)  
    }
};

export const handleUpdateVideo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, video_url, video_order } = req.body
    const data = await videoService.updateVideo(Number(id), title, video_url, Number(video_order));
    return res.status(200).json({ success: true, data });
  } catch(err : unknown) {
     handleError(err,res)  }
};


type payload ={ title:string, video_url:string, video_order:string }


export const handleDeleteVideo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    await videoService.removeVideo(Number(id));
    return res.status(200).json({ success: true, message: "Video successfully deleted" });
  } catch (err : unknown) {
    handleError(err,res)
  }
};

