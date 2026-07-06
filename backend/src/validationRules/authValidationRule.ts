import { z } from "zod";

export const signupRules = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters long"),
    email: z.string().trim().toLowerCase().pipe(z.email("Invalid email address format")),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  }),
});

export const loginRules = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().pipe(z.email("Invalid email address format")),
    password: z.string().min(1, "Password is required"),
  }),
});

export type SignupInput = z.infer<typeof signupRules>;
export type SignupBody = z.infer<typeof signupRules>["body"];

export type loginInput = z.infer<typeof loginRules>;
export type loginBody = z.infer<typeof loginRules>["body"];

