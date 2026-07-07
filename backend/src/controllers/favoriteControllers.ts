import { Request, Response } from "express";
import { FavoriteService } from "../services/favoriteServices";

// If your auth middleware attaches 'user' to the request, 
// you can extend the Request type like this:
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
  body: {
    courseId: string;
  };
}

export const toggleFavorite = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { courseId } = req.body;
  
  // Guard clause in case auth middleware didn't populate req.user
  if (!req.user?.id) {
    res.status(401).json({ error: "Unauthorized access." });
    return;
  }

  const userId = req.user.id;

  try {
    const result = await FavoriteService.toggleCourseFavorite(Number (userId),Number (courseId));
    
    // Fixed status code from 21 to 201 (Created)
    const statusCode = result.isFavorite ? 201 : 200; 
    
    res.status(statusCode).json({ 
      favorite: result.isFavorite, 
      message: result.message 
    });
  } catch (error: any) {
    console.error("Favorite Controller Error:", error);
    res.status(500).json({ error: "Unable to modify favorite state." });
  }
};

export const getUserFavorites = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user?.id) {
    res.status(401).json({ error: "Unauthorized access." });
    return;
  }

  const userId = req.user.id;

  try {
    const favorites = await FavoriteService.fetchUserFavoriteCourses(Number (userId));
    res.status(200).json({ favorites });
  } catch (error: any) {
    console.error("Get Favorites Controller Error:", error);
    res.status(500).json({ error: "Internal Server Lookup Error." });
  }
};