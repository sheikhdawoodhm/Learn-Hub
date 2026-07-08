import pool from "../dbSetup/db";

export const getCertificateByUserAndCourse = async (userId: number, courseId: number) => {
  const result = await pool.query(
    `SELECT * FROM certificates WHERE user_id = $1 AND course_id = $2`,
    [userId, courseId]
  );
  return result.rows[0];
};

export const createCertificate = async (userId: number, courseId: number, certificateUrl: string) => {
  const result = await pool.query(
    `INSERT INTO certificates (user_id, course_id, certificate_url) 
     VALUES ($1, $2, $3) 
     ON CONFLICT (user_id, course_id) DO NOTHING 
     RETURNING *`,
    [userId, courseId, certificateUrl]
  );
  return result.rows[0];
};

export const checkCourseCompletion = async (userId: number, courseId: number) => {
  // Get all active videos in the course
  const totalVideosResult = await pool.query(
    `SELECT v.id FROM videos v
     JOIN modules m ON v.module_id = m.id
     WHERE m.course_id = $1`,
    [courseId]
  );
  const totalVideos = totalVideosResult.rows.length;

  // Get completed videos by this user for this course
  const completedVideosResult = await pool.query(
    `SELECT count(DISTINCT video_id) as count 
     FROM user_progress 
     WHERE user_id = $1 AND course_id = $2 AND status = 'completed'`,
    [userId, courseId]
  );
  const completedVideos = parseInt(completedVideosResult.rows[0].count);

  return { totalVideos, completedVideos };
};
