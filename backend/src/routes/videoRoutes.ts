import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import * as ctrl from "../controllers/videoControllers";

const router = Router();


router.get("/module/:moduleId", ctrl.handleGetVideosByModule);


router.post("/", authenticateToken, ctrl.handleCreateVideo);
router.put("/:id", authenticateToken, ctrl.handleUpdateVideo);
router.delete("/:id", authenticateToken, ctrl.handleDeleteVideo);

export default router;