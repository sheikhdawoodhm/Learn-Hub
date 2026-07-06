import pool from "../dbSetup/db";

export const selectReviewsByCourseId = async (courseId: number) => {
  const query = `
    SELECT 
      COALESCE(c.user_id, r.user_id) as user_id,
      u.name as user_name,
      c.id as comment_id,
      c.comment_text,
      c.created_at as comment_date,
      r.id as rating_id,
      r.rating
    FROM comments c
    FULL OUTER JOIN ratings r ON c.course_id = r.course_id AND c.user_id = r.user_id
    JOIN users u ON u.id = COALESCE(c.user_id, r.user_id)
    WHERE COALESCE(c.course_id, r.course_id) = $1
    ORDER BY c.created_at DESC;
  `;
  const res = await pool.query(query, [courseId]);
  return res.rows;
};


export const insertComment = async (userId: number, courseId: number, commentText: string) => {
  const query = `
    INSERT INTO comments (user_id, course_id, comment_text)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const res = await pool.query(query, [userId, courseId, commentText]);
  return res.rows[0];
};


export const upsertRating = async (userId: number, courseId: number, rating: number) => {
  const query = `
    INSERT INTO ratings (user_id, course_id, rating)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, course_id)
    DO UPDATE SET rating = $3
    RETURNING *;
  `;
  const res = await pool.query(query, [userId, courseId, rating]);
  return res.rows[0];
};