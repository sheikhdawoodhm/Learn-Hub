import { findUserByEmail, createUser, createOAuthUser, createSession } from "../queries/authQueries"; 
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";


const ACCESS_SECRET = "super_secret_key_123";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_super_secret_111";
const VALID_ROLES = new Set(["student", "instructor", "admin"]);

export const registerUser = async (name: string, email: string, password: string, role = "student") => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const normalizedRole = VALID_ROLES.has(role) ? role : "student";
  const newUser = await createUser(name, email, hashedPassword, normalizedRole);
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


  const sessionId = crypto.randomUUID();
  const createdAt = Date.now();
  const expiresAt = createdAt + 7 * 24 * 60 * 60 * 1000; // 7 days in ms

  await createSession(sessionId, user.id, createdAt, expiresAt);

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role, sessionId }, 
    ACCESS_SECRET, 
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, sessionId }, 
    REFRESH_SECRET, 
    { expiresIn: "7d" }
  );

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  };
};

export const loginOAuthUser = async (name: string | undefined, email: string, role = "student") => {
  const normalizedRole = VALID_ROLES.has(role) ? role : "student";
  const generatedPassword = await bcrypt.hash(`oauth:${email}:${REFRESH_SECRET}`, 10);
  const user = await createOAuthUser(name || email.split("@")[0], email, generatedPassword, normalizedRole);

  const sessionId = crypto.randomUUID();
  const createdAt = Date.now();
  const expiresAt = createdAt + 7 * 24 * 60 * 60 * 1000; // 7 days in ms

  await createSession(sessionId, user.id, createdAt, expiresAt);

  const accessToken = jwt.sign(
    { id: user.id, email: user.email, role: user.role, sessionId },
    ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, sessionId },
    REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  };
};
