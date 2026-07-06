import pool from "../dbSetup/db";

export const selectQuizWithDetailsByVideoId = async (videoId: number) => {
  const query = `
    SELECT 
      q.id as quiz_id, q.title as quiz_title,
      qq.id as question_id, qq.question_text,
      qo.id as option_id, qo.option_text, qo.is_correct
    FROM quizzes q
    LEFT JOIN quiz_questions qq ON q.id = qq.quiz_id
    LEFT JOIN quiz_options qo ON qq.id = qo.question_id
    WHERE q.video_id = $1;
  `;
  const res = await pool.query(query, [videoId]);
  return res.rows;
};


export const insertQuiz = async (videoId: number, title: string) => {
  const query = "INSERT INTO quizzes (video_id, title) VALUES ($1, $2) RETURNING *;";
  const res = await pool.query(query, [videoId, title]);
  return res.rows[0];
};


export const insertQuestion = async (quizId: number, questionText: string) => {
  const query = "INSERT INTO quiz_questions (quiz_id, question_text) VALUES ($1, $2) RETURNING *;";
  const res = await pool.query(query, [quizId, questionText]);
  return res.rows[0];
};


export const insertOption = async (questionId: number, optionText: string, isCorrect: boolean) => {
  const query = "INSERT INTO quiz_options (question_id, option_text, is_correct) VALUES ($1, $2, $3) RETURNING *;";
  const res = await pool.query(query, [questionId, optionText, isCorrect]);
  return res.rows[0];
};


export const deleteQuizById = async (id: number) => {
  await pool.query("DELETE FROM quizzes WHERE id = $1", [id]);
};