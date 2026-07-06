import * as ProgressQueries from "../queries/progressQueries";

export const ProgressService = {
  async saveProgressRecord(userId: number, courseId: number, moduleId: number, videoId: number, lectureKey: string) {

    const quizId = await ProgressQueries.findQuizIdByVideo(videoId);
    

    await ProgressQueries.upsertProgressMilestone(userId, courseId, moduleId, videoId, quizId, lectureKey);
    return "Progress saved permanently to DB.";
  },

  async fetchProgressKeysForUser(userId: number): Promise<string[]> {
    return await ProgressQueries.getProgressKeys(userId);
  }
};