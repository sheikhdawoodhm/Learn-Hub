import pool from '../dbSetup/db';

const seedQuizzes = async () => {
  try {
    const videosRes = await pool.query('SELECT id FROM videos');
    const videos = videosRes.rows;
    for (const v of videos) {
      const qRes = await pool.query(
        'INSERT INTO quizzes (video_id, title) VALUES ($1, $2) RETURNING id',
        [v.id, 'Knowledge Check']
      );
      const quizId = qRes.rows[0].id;
      
      const qqRes = await pool.query(
        'INSERT INTO quiz_questions (quiz_id, question_text) VALUES ($1, $2) RETURNING id',
        [quizId, 'What is the main topic of this lesson?']
      );
      const questionId = qqRes.rows[0].id;
      
      await pool.query(
        'INSERT INTO quiz_options (question_id, option_text, is_correct) VALUES ($1, $2, $3)',
        [questionId, 'The core concepts', true]
      );
      await pool.query(
        'INSERT INTO quiz_options (question_id, option_text, is_correct) VALUES ($1, $2, $3)',
        [questionId, 'Something unrelated', false]
      );
      await pool.query(
        'INSERT INTO quiz_options (question_id, option_text, is_correct) VALUES ($1, $2, $3)',
        [questionId, 'I do not know', false]
      );
      await pool.query(
        'INSERT INTO quiz_options (question_id, option_text, is_correct) VALUES ($1, $2, $3)',
        [questionId, 'None of the above', false]
      );
    }
    console.log('✅ Seeded quizzes for all videos!');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};
seedQuizzes();
