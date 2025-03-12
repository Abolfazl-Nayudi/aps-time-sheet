import { z } from "zod";

export const ChangePasswordFormSchema = z
  .object({
    oldPassword: z.string().min(6, "Old password must be at least 6 characters").min(1, "Old password is required"),
    newPassword: z.string().min(6, "new password must be at least 6 characters").min(1, "New password is required"),
    confirmNewPassword: z.string().min(6, "Password confirmation must match"),
  })
  .refine(data => data.oldPassword !== data.newPassword, {
    message: "old and new passwords must be different",
    path: ["newPassword"],
  })
  .refine(data => data.newPassword === data.confirmNewPassword, {
    message: "Passwords must match",
    path: ["confirmNewPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof ChangePasswordFormSchema>;
