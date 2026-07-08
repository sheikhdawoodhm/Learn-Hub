import { Router } from "express";
import { authenticateToken } from "../middleware/authMiddleware";
import * as ctrl from "../controllers/certificateControllers";

const router = Router();

router.get("/course/:courseId", authenticateToken, ctrl.handleGetCertificate);
router.post("/course/:courseId", authenticateToken, ctrl.handleGenerateCertificate);

export default router;
