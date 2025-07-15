
import * as z from "zod";

// Enhanced password schema with stronger security requirements
const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .refine(
    (password) => /[A-Z]/.test(password),
    "Password must contain at least one uppercase letter"
  )
  .refine(
    (password) => /[a-z]/.test(password),
    "Password must contain at least one lowercase letter"
  )
  .refine(
    (password) => /[0-9]/.test(password),
    "Password must contain at least one number"
  )
  .refine(
    (password) => /[^A-Za-z0-9]/.test(password),
    "Password must contain at least one special character"
  )
  .refine(
    (password) => !/(.)\1{2,}/.test(password),
    "Password must not contain more than 2 consecutive identical characters"
  )
  .refine(
    (password) => !/password|qwerty|admin|welcome|abc123|111111|123123/i.test(password),
    "Password contains common patterns and is too predictable"
  )
  .refine(
    (password) => !/qwertyuiop|asdfghjkl|zxcvbnm|1234567890/.test(password.toLowerCase()),
    "Password contains keyboard patterns"
  );

// Enhanced email validation
const emailSchema = z
  .string()
  .email("Please enter a valid email address")
  .min(5, "Email is too short")
  .max(254, "Email is too long")
  .refine(
    (email) => !email.includes('..'),
    "Email cannot contain consecutive dots"
  )
  .refine(
    (email) => !/[<>"/\\]/.test(email),
    "Email contains invalid characters"
  );

// Enhanced name validation
const nameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must not exceed 100 characters")
  .refine(
    (name) => !/[<>"/\\]/.test(name),
    "Name contains invalid characters"
  )
  .refine(
    (name) => name.trim().length > 0,
    "Name cannot be empty or only whitespace"
  );

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  full_name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
