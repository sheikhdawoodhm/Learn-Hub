import { Pool, PoolClient } from "pg";
import pool from "../dbSetup/db";
import { CreateCourseInput,SaveModulesInput } from "../validationRules/courseValidationRule";
import { GetCoursesQueryInput } from "../validationRules/courseValidationRule";
import * as courseQueries from "../queries/courseQueries";


export const createDraftCourse = async (courseData: CreateCourseInput) => {
  return await courseQueries.insertCourseDraft(courseData);
};

export const saveNestedModulesTree = async (saveModulesInput: SaveModulesInput,courseId: string) => {
  const {  modules } = saveModulesInput;
  const client: PoolClient = await pool.connect();

  try {
    await client.query("BEGIN");

    for (let mIndex = 0; mIndex < modules.length; mIndex++) {
      const mod = modules[mIndex];
      const moduleOrder = mIndex + 1; // 1, 2, 3...

      const newModuleId = await courseQueries.insertModuleRecord(client, courseId, mod.moduleName, moduleOrder);

      for (let vIndex = 0; vIndex < mod.videos.length; vIndex++) {
        const video = mod.videos[vIndex];
        const videoOrder = vIndex + 1; // 1, 2, 3...

        const newVideoId = await courseQueries.insertVideoRecord(client, newModuleId, video.videoTitle, video.videoUrl, videoOrder);

        for (const q of video.questions) {
          await courseQueries.insertQuizRecord(client, newVideoId, q);
        }
      }
    }

    await courseQueries.updateCourseStatusToPublished(client, courseId);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Critical service execution failure. Database transaction aborted.", error);
    throw error;
  } finally {
    client.release();
  }
};

export const fetchPublishedCourses = async (options:  GetCoursesQueryInput,userId: number) => {
  const { page, limit, search,   category, status } = options;
  return await courseQueries.getAllCourses({ page, limit, search, category, status},userId);
};

