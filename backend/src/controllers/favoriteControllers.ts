import { Response } from "express";
import { FavoriteService } from "../services/favoriteServices";

export const toggleFavorite = async (req: any, res: Response) => {
  const { courseId } = req.body;
  const userId = req.user.id;

  try {
    const result = await FavoriteService.toggleCourseFavorite(userId, courseId);
    res.status(result.isFavorite ? 21 : 200).json({ 
      favorite: result.isFavorite, 
      message: result.message 
    });
  } catch (error: any) {
    console.error("Favorite Controller Error:", error.message);
    res.status(500).json({ error: "Unable to modify favorite state." });
  }
};

export const getUserFavorites = async (req: any, res: Response) => {
  const userId = req.user.id;
  try {
    const favorites = await FavoriteService.fetchUserFavoriteCourses(userId);
    res.status(200).json({ favorites });
  } catch (error: any) {
    console.error("Get Favorites Controller Error:", error.message);
    res.status(500).json({ error: "Internal Server Lookup Error" });
  }
};