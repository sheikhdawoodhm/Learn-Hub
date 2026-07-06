import * as videoQueries from "../queries/videoQueries";

export const getVideosByModule = async (moduleId: number) => {
  return await videoQueries.selectVideosByModuleId(moduleId);
};

export const createVideo = async (moduleId: number, title: string, videoUrl: string, videoOrder: number) => {
  return await videoQueries.insertVideo(moduleId, title, videoUrl, videoOrder);
};

export const updateVideo = async (id: number, title: string, videoUrl: string, videoOrder: number) => {
  return await videoQueries.updateVideoById(id, title, videoUrl, videoOrder);
};

export const removeVideo = async (id: number) => {
  await videoQueries.deleteVideoById(id);
};