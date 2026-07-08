import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/authorizeRoles";
import * as ctrl from "../controllers/moduleControllers";
import { getCourseSyllabus } from "../controllers/moduleControllers";

const router = Router();


router.get("/course/:courseId", ctrl.handleGetModulesByCourse);


router.post("/", authenticateToken, authorizeRoles('admin'), ctrl.handleCreateModule);
router.put("/:id", authenticateToken, authorizeRoles('admin'), ctrl.handleUpdateModule);
router.delete("/:id", authenticateToken, authorizeRoles('admin'), ctrl.handleDeleteModule);
router.get("/:courseId/syllabus", authenticateToken, ctrl.getCourseSyllabus);

export default router;