import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/authorizeRoles";
import * as ctrl from "../controllers/quizControllers";

const router = Router();


router.get("/video/:videoId", ctrl.handleGetQuizByVideo);


router.post("/", authenticateToken, authorizeRoles('admin'), ctrl.handleCreateQuiz);
router.post("/question", authenticateToken, authorizeRoles('admin'), ctrl.handleAddQuestion);
router.put("/question/:id", authenticateToken, authorizeRoles('admin'), ctrl.handleUpdateQuestion);
router.post("/option", authenticateToken, authorizeRoles('admin'), ctrl.handleAddOption);
router.delete("/:id", authenticateToken, authorizeRoles('admin'), ctrl.handleDeleteQuiz);

router.post("/validate-answer", authenticateToken, ctrl.handleValidateAnswer);

export default router;