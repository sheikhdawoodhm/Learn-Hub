import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { findSession } from "../queries/authQueries";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
    sessionId?: string;
  };
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ success: false, message: "Access Denied: No Token Provided" });
    return;
  }
 
  try {
    const secret = "super_secret_key_123";
    
    const verified = jwt.verify(token, secret) as { id: number; email: string; role: string; sessionId?: string };
    
    if (verified.sessionId) {
      const session = await findSession(verified.sessionId);
      if (!session) {
        res.status(401).json({ success: false, message: "Session expired or invalid" });
        return;
      }
    }

    req.user = verified; 
    
    next();
  } catch (error) {
    res.status(403).json({ success: false, message: "Invalid or Expired Token" });
    return;
  }
};