import pool from "../dbSetup/db";


export const selectVideosByModuleId = async (moduleId: number) => {
  const query = `
    SELECT * FROM videos 
    WHERE module_id = $1 
    ORDER BY video_order ASC;
  `;
  const res = await pool.query(query, [moduleId]);
  return res.rows;
};


export const insertVideo = async (moduleId: number, title: string, videoUrl: string, videoOrder: number) => {
  const query = `
    INSERT INTO videos (module_id, title, video_url, video_order) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *;
  `;
  const res = await pool.query(query, [moduleId, title, videoUrl, videoOrder]);
  return res.rows[0];
};


export const updateVideoById = async (id: number, title: string, videoUrl: string, videoOrder: number) => {
  const query = `
    UPDATE videos 
    SET title = $1, video_url = $2, video_order = $3 
    WHERE id = $4 
    RETURNING *;
  `;
  const res = await pool.query(query, [title, videoUrl, videoOrder, id]);
  return res.rows[0];
};


export const deleteVideoById = async (id: number) => {
  await pool.query("DELETE FROM videos WHERE id = $1", [id]);
};