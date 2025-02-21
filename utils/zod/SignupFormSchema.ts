import { z } from "zod";

export const SignupFormSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters").min(1, "Password is required"),
    confirmPassword: z.string().min(6, "Password confirmation must match"),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof SignupFormSchema>;
