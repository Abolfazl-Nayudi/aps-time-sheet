import { z } from "zod";

export const ExportModalFormSchema = z.object({
  page: z.string(),
  row: z.string().regex(
    /^[A-Z]+[1-9]\d*$/, // Regex explanation below
    "Invalid cell format. Use column letters followed by row numbers (e.g., B4, G2).",
  ),
});

export type ExportModalFormValues = z.infer<typeof ExportModalFormSchema>;
