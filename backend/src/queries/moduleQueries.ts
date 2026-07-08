import pool from "../dbSetup/db";


export const selectModulesByCourseId = async (courseId: number) => {
  const query = `
    SELECT * FROM modules 
    WHERE course_id = $1 
    ORDER BY module_order ASC;
  `;
  const res = await pool.query(query, [courseId]);
  return res.rows;
};


export const insertModule = async (courseId: number, title: string, moduleOrder: number) => {
  const query = `
    INSERT INTO modules (course_id, title, module_order) 
    VALUES ($1, $2, $3) 
    RETURNING *;
  `;
  const res = await pool.query(query, [courseId, title, moduleOrder]);
  return res.rows[0];
};


export const updateModuleById = async (id: number, title: string, moduleOrder: number) => {
  const query = `
    UPDATE modules 
    SET title = $1, module_order = $2 
    WHERE id = $3 
    RETURNING *;
  `;
  const res = await pool.query(query, [title, moduleOrder, id]);
  return res.rows[0];
};




export const deleteModuleById = async (id: number) => {
  await pool.query("DELETE FROM modules WHERE id = $1", [id]);
};


export const fetchSyllabusByCourseId = async (courseId: string | number) => {
  const statement = `
    SELECT COALESCE(
      (
        SELECT json_agg(
          json_build_object(
            'id', m.id::text,
            'moduleName', m.title,
            'videos', COALESCE(
              (
                SELECT json_agg(
                  json_build_object(
                    'id', v.id::text,
                    'videoTitle', v.title,
                    'videoUrl', v.video_url,
                    'questions', COALESCE(
                      (
                        SELECT json_agg(
                          json_build_object(
                            'id', q_flat.question_id::text,
                            'question', q_flat.question_text,
                            'optionA', q_flat.optionA,
                            'optionB', q_flat.optionB,
                            'optionC', q_flat.optionC,
                            'optionD', q_flat.optionD
                          )
                        )
                        FROM (
                          SELECT 
                            qq.id AS question_id,
                            qq.question_text,
                            max(CASE WHEN opt.idx = 1 THEN opt.option_text END) AS optionA,
                            max(CASE WHEN opt.idx = 2 THEN opt.option_text END) AS optionB,
                            max(CASE WHEN opt.idx = 3 THEN opt.option_text END) AS optionC,
                            max(CASE WHEN opt.idx = 4 THEN opt.option_text END) AS optionD,
                            max(CASE WHEN opt.is_correct = TRUE THEN 
                              CASE WHEN opt.idx = 1 THEN 'A'
                                   WHEN opt.idx = 2 THEN 'B'
                                   WHEN opt.idx = 3 THEN 'C'
                                   WHEN opt.idx = 4 THEN 'D'
                              END
                            END) AS correctAnswer
                          FROM quizzes qz
                          JOIN quiz_questions qq ON qq.quiz_id = qz.id
                          JOIN (
                            SELECT *, row_number() OVER (PARTITION BY question_id ORDER BY id) as idx
                            FROM quiz_options
                          ) opt ON opt.question_id = qq.id
                          WHERE qz.video_id = v.id
                          GROUP BY qq.id, qq.question_text
                        ) q_flat
                      ), '[]'::json
                    )
                  ) ORDER BY v.video_order ASC
                ) FROM videos v WHERE v.module_id = m.id
              ), '[]'::json
            )
          ) ORDER BY m.module_order ASC
        ) FROM modules m WHERE m.course_id = $1
      ), '[]'::json
    ) AS modules;
  `;

  const queryResult = await pool.query(statement, [courseId]);
  return queryResult.rows[0]?.modules || [];
};