import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string; // Added to match your token payload structure safely!
    role: string;
  };
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Access Denied: No Token Provided" });
  }
 
  try {
    const secret = "super_secret_key_123";
    

    const verified = jwt.verify(token, secret) as { id: number; email: string; role: string };
    
    req.user = verified; // This works flawlessly now with no compiler warnings!
    
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: "Invalid or Expired Token" });
  }
};