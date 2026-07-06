import { Response } from "express";


export function handleError(error: unknown, res: Response) {
  console.error("Internal Server Error:", error);

  if (
    typeof error === "object" && 
    error !== null && 
    "message" in error && 
    typeof (error as Record<string, unknown>).message === "string"
  ) {
    return res.status(500).json({ 
      success: false, 
      error: (error as { message: string }).message 
    });
  }

  return res.status(500).json({ 
    success: false, 
    error: "An unexpected error occurred." 
  });
}