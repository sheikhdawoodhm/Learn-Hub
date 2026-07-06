import * as quizQueries from "../queries/quizQueries";

export const getFullQuizByVideo = async (videoId: number) => {
  const rows = await quizQueries.selectQuizWithDetailsByVideoId(videoId);
  if (!rows || rows.length === 0) return null;

  
  const quizStructure = {
    id: rows[0].quiz_id,
    title: rows[0].quiz_title,
    questions: [] as any[]
  };

  const questionMap: { [key: number]: any } = {};

  rows.forEach((row) => {
    if (row.question_id) {
      if (!questionMap[row.question_id]) {
        questionMap[row.question_id] = {
          id: row.question_id,
          text: row.question_text,
          options: []
        };
        quizStructure.questions.push(questionMap[row.question_id]);
      }

      if (row.option_id) {
        questionMap[row.question_id].options.push({
          id: row.option_id,
          text: row.option_text,
          isCorrect: row.is_correct
        });
      }
    }
  });

  return quizStructure;
};

export const createQuiz = async (videoId: number, title: string) => {
  return await quizQueries.insertQuiz(videoId, title);
};

export const addQuestionToQuiz = async (quizId: number, questionText: string) => {
  return await quizQueries.insertQuestion(quizId, questionText);
};

export const addOptionToQuestion = async (questionId: number, optionText: string, isCorrect: boolean) => {
  return await quizQueries.insertOption(questionId, optionText, isCorrect);
};

export const removeQuiz = async (id: number) => {
  await quizQueries.deleteQuizById(id);
};