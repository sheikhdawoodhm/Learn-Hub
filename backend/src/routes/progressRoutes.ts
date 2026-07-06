import {  authenticateToken } from "../middleware/authMiddleware";
import { Router } from "express";
import { getUserProgressHistory, syncProgress } from "../controllers/progressControllers";

const router = Router();


router.use(authenticateToken);


router.post("/sync", authenticateToken, syncProgress);
router.get("/user-history", authenticateToken, getUserProgressHistory);

export default router;