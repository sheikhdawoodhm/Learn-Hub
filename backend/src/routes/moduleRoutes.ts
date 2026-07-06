import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import * as ctrl from "../controllers/moduleControllers";
import { getCourseSyllabus } from "../controllers/moduleControllers";

const router = Router();


router.get("/course/:courseId", ctrl.handleGetModulesByCourse);


router.post("/", authenticateToken, ctrl.handleCreateModule);
router.put("/:id", authenticateToken, ctrl.handleUpdateModule);
router.delete("/:id", authenticateToken, ctrl.handleDeleteModule);
router.get("/:courseId/syllabus",authenticateToken, ctrl.getCourseSyllabus);

export default router;