import { PoolClient } from "pg";
import { CreateCourseInput, GetCoursesQueryInput } from "../validationRules/courseValidationRule";
import pool from "../dbSetup/db";
import { NextFunction } from "express";

export const insertCourseDraft = async (course: CreateCourseInput) => {
  const statement = `
    INSERT INTO courses (title, category, description, thumbnail_url, status)
    VALUES ($1, $2, $3, $4, 'DRAFT')
    RETURNING id, title, status;
  `;
  const parameters = [course.title, course.category, course.description, course.thumbnail];
  const queryResult = await pool.query(statement, parameters);
  return queryResult.rows[0];
};

export const insertModuleRecord = async (client: PoolClient, courseId: string, moduleName: string, moduleOrder: number): Promise<string> => {
  const statement = `INSERT INTO modules (course_id, title, module_order) VALUES ($1, $2, $3) RETURNING id;`;
  const result = await client.query(statement, [courseId, moduleName, moduleOrder]);
  return result.rows[0].id;
};

export const insertVideoRecord = async (client: PoolClient, moduleId: string, title: string, url: string, videoOrder: number): Promise<string> => {
  const statement = `INSERT INTO videos (module_id, title, video_url, video_order) VALUES ($1, $2, $3, $4) RETURNING id;`;
  const result = await client.query(statement, [moduleId, title, url, videoOrder]);
  return result.rows[0].id;
};

export const insertQuizRecord = async (client: PoolClient, videoId: string, q: any): Promise<void> => {
  const quizStatement = `
    INSERT INTO quizzes (video_id, title)
    VALUES ($1, $2)
    RETURNING id;
  `;
  const quizResult = await client.query(quizStatement, [videoId, "Lesson Quiz"]);
  const quizId = quizResult.rows[0].id;

  const questionStatement = `
    INSERT INTO quiz_questions (quiz_id, question_text)
    VALUES ($1, $2)
    RETURNING id;
  `;
  const questionResult = await client.query(questionStatement, [quizId, q.question]);
  const questionId = questionResult.rows[0].id;

  const options = [
    { text: q.optionA, isCorrect: q.correctAnswer === "A" },
    { text: q.optionB, isCorrect: q.correctAnswer === "B" },
    { text: q.optionC, isCorrect: q.correctAnswer === "C" },
    { text: q.optionD, isCorrect: q.correctAnswer === "D" },
  ];

  const optionStatement = `
    INSERT INTO quiz_options (question_id, option_text, is_correct)
    VALUES ($1, $2, $3);
  `;

  for (const option of options) {
    await client.query(optionStatement, [questionId, option.text, option.isCorrect]);
  }
};

export const updateCourseStatusToPublished = async (client: PoolClient, courseId: string): Promise<void> => {
  const statement = `UPDATE courses SET status = 'PUBLISHED' WHERE id = $1;`;
  await client.query(statement, [courseId]);
};




export const getAllCourses = async ({ page, limit, search, category, status }: GetCoursesQueryInput, userId: number) => {
  const offset = (page - 1) * limit;

  // 1. Added 'WHERE c.status != 'draft'' to ensure drafts are never returned
  let dataQuery = `
    SELECT 
      c.*,
      COUNT(DISTINCT m.id)::int as total_modules, 
      COUNT(DISTINCT v.id)::int as total_videos,
      COUNT(DISTINCT CASE WHEN v.quiz_count = v.passed_count THEN v.id END)::int as completed_videos
    FROM courses c
    LEFT JOIN modules m ON c.id = m.course_id
    LEFT JOIN (
      SELECT 
        vid.id, 
        vid.module_id,
        COUNT(DISTINCT q.id) as quiz_count,
        COUNT(DISTINCT vp.quiz_id) as passed_count
      FROM videos vid
      LEFT JOIN quizzes q ON vid.id = q.video_id
      LEFT JOIN user_progress vp ON q.id = vp.quiz_id AND vp.user_id = $1
      GROUP BY vid.id
    ) v ON m.id = v.module_id
    WHERE c.status != 'DRAFT'
  `;
  
  // 2. Added 'WHERE c.status != 'draft'' here as well
  let countQuery = `
    SELECT 
      c.id,
      COUNT(DISTINCT v.id)::int as total_videos,
      COUNT(DISTINCT CASE WHEN v.quiz_count = v.passed_count THEN v.id END)::int as completed_videos
    FROM courses c
    LEFT JOIN modules m ON c.id = m.course_id
    LEFT JOIN (
      SELECT 
        vid.id, 
        vid.module_id,
        COUNT(DISTINCT q.id) as quiz_count,
        COUNT(DISTINCT vp.quiz_id) as passed_count
      FROM videos vid
      LEFT JOIN quizzes q ON vid.id = q.video_id
      LEFT JOIN user_progress vp ON q.id = vp.quiz_id AND vp.user_id = $1
      GROUP BY vid.id
    ) v ON m.id = v.module_id
    WHERE c.status != 'DRAFT'
  `;
  
  const queryValues: any[] = [userId];
  let index = 2;

  if (category && category !== "All") {
    dataQuery += ` AND c.category = $${index}`;
    countQuery += ` AND c.category = $${index}`;
    queryValues.push(category);
    index++;
  }

  if (search) {
    dataQuery += ` AND (LOWER(c.title) LIKE $${index} OR LOWER(c.description) LIKE $${index})`;
    countQuery += ` AND (LOWER(c.title) LIKE $${index} OR LOWER(c.description) LIKE $${index})`;
    queryValues.push(`%${search.toLowerCase()}%`);
    index++;
  }

  // CRITICAL FIX: Both queries MUST group by c.id because they use aggregate functions
  dataQuery += ` GROUP BY c.id`;
  countQuery += ` GROUP BY c.id`;

  if (status && status !== "All") {
    if (status === "Completed") {
      const completionFilter = ` HAVING COUNT(DISTINCT CASE WHEN v.quiz_count = v.passed_count THEN v.id END) = COUNT(DISTINCT v.id) AND COUNT(DISTINCT v.id) > 0`;
      dataQuery += completionFilter;
      countQuery += completionFilter;
    } else if (status === "In Progress") {
      const progressFilter = ` HAVING COUNT(DISTINCT CASE WHEN v.quiz_count = v.passed_count THEN v.id END) > 0 AND COUNT(DISTINCT CASE WHEN v.quiz_count = v.passed_count THEN v.id END) < COUNT(DISTINCT v.id)`;
      dataQuery += progressFilter;
      countQuery += progressFilter;
    } else if (status === "Not Started") {
      const notStartedFilter = ` HAVING COUNT(DISTINCT CASE WHEN v.quiz_count = v.passed_count THEN v.id END) = 0`;
      dataQuery += notStartedFilter;
      countQuery += notStartedFilter;
    }
  }

  // CRITICAL FIX: Wrapped count query in a subquery wrapper to accurately count the filtered results
  const wrappedCountQuery = `SELECT COUNT(*)::int FROM (${countQuery}) as filtered_courses`;
  const countResult = await pool.query(wrappedCountQuery, queryValues);
  
  const totalItems = countResult.rows[0] ? parseInt(countResult.rows[0].count, 10) : 0; 

  dataQuery += ` ORDER BY c.id DESC LIMIT $${index} OFFSET $${index + 1}`;
  
  const finalValues = [...queryValues, limit, offset];
  const dataResult = await pool.query(dataQuery, finalValues);

  return {
    courses: dataResult.rows,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit) || 1,
      totalItems,
    }
  };
};