import { z } from "zod";

export const signupRules = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters long"),
    email: z.string().trim().toLowerCase().pipe(z.email("Invalid email address format")),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["student", "instructor", "admin"]).optional().default("student"),
  }),
});

export const loginRules = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().pipe(z.email("Invalid email address format")),
    password: z.string().min(1, "Password is required"),
  }),
});

export const oauthRules = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Name is required").optional(),
    email: z.string().trim().toLowerCase().pipe(z.email("Invalid email address format")),
    picture: z.string().trim().url().optional(),
    provider: z.string().trim().optional().default("google"),
    role: z.enum(["student", "instructor", "admin"]).optional().default("student"),
  }),
});

export type SignupInput = z.infer<typeof signupRules>;
export type SignupBody = z.infer<typeof signupRules>["body"];

export type loginInput = z.infer<typeof loginRules>;
export type loginBody = z.infer<typeof loginRules>["body"];
export type OAuthBody = z.infer<typeof oauthRules>["body"];
