import { findUserByEmail, createUser } from "../queries/authQueries"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const ACCESS_SECRET = "super_secret_key_123";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_super_secret_111";

export const registerUser = async (name: string, email: string, password: string,role : string) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser(name, email, hashedPassword,role);
  return newUser;
};

export const loginUser = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User doesnt exist");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("INVALID_CREDENTIALS");
  }


  const accessToken = jwt.sign(
    { id: user.id, email: user.email }, 
    ACCESS_SECRET, 
    { expiresIn: "15m" }
  );


  const refreshToken = jwt.sign(
    { id: user.id }, 
    REFRESH_SECRET, 
    { expiresIn: "7d" }
  );

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email }
  };
};

