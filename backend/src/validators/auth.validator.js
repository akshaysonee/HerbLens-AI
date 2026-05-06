import { z } from "zod";

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#])[A-Za-z\d@$!%*?&^#]{8,}$/;

// ================= REGISTER =================
export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),

    email: z.string().email("Invalid email"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        strongPasswordRegex,
        "Password must contain uppercase, lowercase, number and special character",
      ),
  }),
});

// ================= LOGIN =================
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),

    password: z.string().min(1, "Password is required"),
  }),
});

// ================= UPDATE PROFILE =================
export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),

    email: z.string().email("Invalid email").optional(),
  }),
});

// ================= CHANGE PASSWORD =================
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required"),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        strongPasswordRegex,
        "Password must contain uppercase, lowercase, number and special character",
      ),
  }),
});
