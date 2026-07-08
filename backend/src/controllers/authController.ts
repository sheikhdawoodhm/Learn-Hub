import { Request, Response } from "express";
import * as authService from "../services/authServices"; 

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password , role} = req.body;
    const newUser = await authService.registerUser(name, email, password, role); 

    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
      user: newUser
    });
  } catch (error: unknown) { 
    if (error instanceof Error || (typeof error === "object" && error !== null && "message" in error)) {
      const errMsg = (error as { message: unknown }).message;
      if (errMsg === "EMAIL_ALREADY_EXISTS") {
        return res.status(400).json({ success: false, message: "Email already registered" });
      }
    }
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const sessionData = await authService.loginUser(email, password);



res.cookie("refreshToken", sessionData.refreshToken, {
  httpOnly: true, // Prevents client-side scripts/XSS from stealing the token
  


  secure: process.env.NODE_ENV === "production", 
  


  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", 
  
  maxAge: 7 * 24 * 60 * 60 * 1000, 
});


    return res.status(200).json({
      success: true,
      message: "Login successful!",
      accessToken: sessionData.accessToken, 
      user: sessionData.user
    });

  } catch (error: unknown) { 
    if (error instanceof Error || (typeof error === "object" && error !== null && "message" in error)) {
      const errMsg = (error as { message: unknown }).message;
      if (errMsg === "User doesnt exist" || errMsg === "INVALID_CREDENTIALS") {
        return res.status(400).json({ success: false, message: "Invalid email or password." });
      }
    }
    return res.status(500).json({ success: false, message: "Internal Server Error during login transaction." });
  }
};

export const oauthLogin = async (req: Request, res: Response) => {
  try {
    const { name, email, role } = req.body;
    const sessionData = await authService.loginOAuthUser(name, email, role);

    res.cookie("refreshToken", sessionData.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Google login successful!",
      accessToken: sessionData.accessToken,
      user: sessionData.user,
    });
  } catch (error) {
    console.error("OAuth login failed:", error);
    return res.status(500).json({ success: false, message: "Google login failed." });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const authReq = req as any;
    if (authReq.user && authReq.user.sessionId) {
      const { deleteSession } = await import("../queries/authQueries");
      await deleteSession(authReq.user.sessionId);
    }
    res.clearCookie("refreshToken");
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ success: false, message: "Server error during logout" });
  }
};
