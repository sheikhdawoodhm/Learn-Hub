import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import * as ctrl from "../controllers/reviewControllers";

const router = Router();




router.get("/course/:courseId", ctrl.handleGetReviews);
router.post("/", authenticateToken, ctrl.handleCreateReview);
router.delete("/:id", authenticateToken, ctrl.handleDeleteComment);

export default router;