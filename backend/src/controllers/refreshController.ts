import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import pool from "../dbSetup/db";

export const refreshSession = async (req: Request, res: Response) => {

  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ success: false, message: "Session missing or expired" });
  }

  try {
    const ACCESS_SECRET = "super_secret_key_123";
    const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_super_secret_111";

    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { id: number };

    const result = await pool.query("SELECT id, name, email, role FROM users WHERE id = $1", [decoded.id]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists" });
    }

    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      ACCESS_SECRET, 
      { expiresIn: "15m" }
    );
    
    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("❌ REFRESH FAILED! Diagnostic details:", {
      status: 403,
      message: "Invalid session validation parameters",
      errorObject: error
    });
    return res.status(403).json({ success: false, message: "Invalid session validation parameters" });
  }
};

