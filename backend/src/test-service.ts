import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../.env") });

import { saveNestedModulesTree } from "./services/courseServices";
import pool from "./dbSetup/db";

async function runTest() {
  try {
    const courseRes = await pool.query("INSERT INTO courses (title, category, description) VALUES ('Test Course', 'Test', 'Test description text') RETURNING id");
    const courseId = courseRes.rows[0].id;

    await saveNestedModulesTree({
      modules: [
        {
          moduleName: "Test Module",
          videos: [
            {
              videoTitle: "Test Video",
              videoUrl: "https://www.youtube.com/watch?v=M7lc1UVf-VE",
              questions: [
                {
                  question: "Test Q",
                  optionA: "A",
                  optionB: "B",
                  optionC: "C",
                  optionD: "D",
                  correctAnswer: "A",
                }
              ]
            }
          ]
        }
      ]
    }, String(courseId));
    console.log("Success!");
  } catch (err) {
    console.error("Failed:", err);
  } finally {
    process.exit(0);
  }
}
runTest();
