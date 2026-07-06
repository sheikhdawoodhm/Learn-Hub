import pool from "../dbSetup/db";


export const findQuizIdByVideo = async (videoId: number): Promise<number> => {
  const result = await pool.query(`SELECT id FROM quizzes WHERE video_id = $1 LIMIT 1`, [videoId]);
  return result.rows[0]?.id || 0; // Standardize fallback safe value
};

export const upsertProgressMilestone = async (
  userId: number, courseId: number, moduleId: number, videoId: number, quizId: number, lectureKey: string
): Promise<void> => {
  await pool.query(
    `INSERT INTO user_progress (user_id, course_id, module_id, video_id, quiz_id, lecture_key, status)
     VALUES ($1, $2, $3, $4, $5, $6, 'completed')
     ON CONFLICT (user_id, lecture_key) DO NOTHING`,
    [userId, courseId, moduleId, videoId, quizId, lectureKey]
  );
};

export const getProgressKeys = async (userId: number): Promise<string[]> => {
  const result = await pool.query(
    `SELECT lecture_key FROM user_progress WHERE user_id = $1 AND status = 'completed'`,
    [userId]
  );
  return result.rows.map(row => row.lecture_key);
};