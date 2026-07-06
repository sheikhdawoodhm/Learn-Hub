import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import * as ctrl from "../controllers/quizControllers";

const router = Router();


router.get("/video/:videoId", ctrl.handleGetQuizByVideo);


router.post("/", authenticateToken, ctrl.handleCreateQuiz);
router.post("/question", authenticateToken, ctrl.handleAddQuestion);
router.post("/option", authenticateToken, ctrl.handleAddOption);
router.delete("/:id", authenticateToken, ctrl.handleDeleteQuiz);

export default router;