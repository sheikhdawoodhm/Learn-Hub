import { Request, Response } from "express";


import{ createUser, findUserByEmail } from "../queries/userQueries";

export const signup = async (
  req: Request,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    console.log("Signup Data Received:");

    console.log({
      name,
      email,
      password,
    });
    createUser(name, email, password);
    res.status(201).json({
      success: true,
      message: "Signup route working",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};