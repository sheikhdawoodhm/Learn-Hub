import { Router } from "express";
import { toggleFavorite, getUserFavorites } from "../controllers/favoriteControllers";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/toggle", authenticateToken, toggleFavorite);
router.get("/", authenticateToken, getUserFavorites);

export default router;