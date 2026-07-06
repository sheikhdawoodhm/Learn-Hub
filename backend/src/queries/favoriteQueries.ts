import pool from "../dbSetup/db";


export const checkFavoriteRelationship = async (userId: number, courseId: number): Promise<boolean> => {
  const checkFav = await pool.query(
    `SELECT id FROM favorites WHERE user_id = $1 AND course_id = $2`,
    [userId, courseId]
  );
  return checkFav.rows.length > 0;
};

export const createFavorite = async (userId: number, courseId: number): Promise<void> => {
  await pool.query(`INSERT INTO favorites (user_id, course_id) VALUES ($1, $2)`, [userId, courseId]);
};

export const deleteFavorite = async (userId: number, courseId: number): Promise<void> => {
  await pool.query(`DELETE FROM favorites WHERE user_id = $1 AND course_id = $2`, [userId, courseId]);
};

export const getFavoriteCoursesMetadata = async (userId: number): Promise<any[]> => {
  const result = await pool.query(
    `SELECT c.*, 
            c.thumbnail_url AS thumbnail,      
            c.thumbnail_url AS thumbnail_url,  
            (SELECT COUNT(*) FROM modules m WHERE m.course_id = c.id) AS total_modules,
            (SELECT COUNT(v.id) FROM videos v JOIN modules m ON m.id = v.module_id WHERE m.course_id = c.id) AS total_lessons
     FROM courses c
     INNER JOIN favorites f ON f.course_id = c.id
     WHERE f.user_id = $1`,
    [userId]
  );
  const data = result.rows;
  return data;
};