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

export const updateQuestionText = async (questionId: number, text: string) => {
  await pool.query("UPDATE quiz_questions SET question_text = $2 WHERE id = $1", [questionId, text]);
};

export const updateOptionText = async (questionId: number, letter: string, text: string) => {
  const letterToIdx: { [key: string]: number } = { 'A': 1, 'B': 2, 'C': 3, 'D': 4 };
  const targetIdx = letterToIdx[letter];
  // Since we don't know the exact option ID, we use the idx approach
  await pool.query(`
    WITH numbered AS (
      SELECT id, row_number() OVER (ORDER BY id ASC) as idx
      FROM quiz_options
      WHERE question_id = $1
    )
    UPDATE quiz_options
    SET option_text = $3
    WHERE id = (SELECT id FROM numbered WHERE idx = $2)
  `, [questionId, targetIdx, text]);
};

export const updateOptionCorrectness = async (questionId: number, correctAnswerLetter: string) => {
  const letterToIdx: { [key: string]: number } = { 'A': 1, 'B': 2, 'C': 3, 'D': 4 };
  const targetIdx = letterToIdx[correctAnswerLetter];
  
  // Set all to false first
  await pool.query("UPDATE quiz_options SET is_correct = false WHERE question_id = $1", [questionId]);
  
  // Set the correct one to true
  await pool.query(`
    WITH numbered AS (
      SELECT id, row_number() OVER (ORDER BY id ASC) as idx
      FROM quiz_options
      WHERE question_id = $1
    )
    UPDATE quiz_options
    SET is_correct = true
    WHERE id = (SELECT id FROM numbered WHERE idx = $2)
  `, [questionId, targetIdx]);
};

export const validateAnswerQuery = async (questionId: number, answerLetter: string) => {
  const query = `
    SELECT is_correct, row_number() OVER (ORDER BY id ASC) as idx
    FROM quiz_options
    WHERE question_id = $1
  `;
  const res = await pool.query(query, [questionId]);
  
  const letterToIdx: { [key: string]: number } = { 'A': 1, 'B': 2, 'C': 3, 'D': 4 };
  const targetIdx = letterToIdx[answerLetter];
  
  const selectedOption = res.rows.find(row => parseInt(row.idx) === targetIdx);
  return selectedOption ? selectedOption.is_correct : false;
};