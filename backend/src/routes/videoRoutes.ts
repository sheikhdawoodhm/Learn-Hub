import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/authorizeRoles";
import * as ctrl from "../controllers/videoControllers";

const router = Router();


router.get("/module/:moduleId", ctrl.handleGetVideosByModule);


router.post("/", authenticateToken, authorizeRoles('admin'), ctrl.handleCreateVideo);
router.put("/:id", authenticateToken, authorizeRoles('admin'), ctrl.handleUpdateVideo);
router.delete("/:id", authenticateToken, authorizeRoles('admin'), ctrl.handleDeleteVideo);

export default router;