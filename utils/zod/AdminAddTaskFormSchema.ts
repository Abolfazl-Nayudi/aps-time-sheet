import z from "zod";

export const AdminAddTaskFormSchema = z
  .object({
    name: z.string().min(1, "Name field is required"),
    price: z
      .string()
      .optional()
      .transform(val => (val && val.trim() !== "" ? parseFloat(val).toFixed(3) : ""))
      .refine(val => val === "" || parseFloat(val) > 0, {
        message: "Price must be a positive number",
      }),
    isByHour: z.boolean().default(false),
    hourPrice: z
      .string()
      .optional()
      .transform(val => (val && val.trim() !== "" ? parseFloat(val).toFixed(3) : ""))
      .refine(val => val === "" || parseFloat(val) > 0, {
        message: "Hour price must be a positive number",
      }),
    categoryId: z.string().min(1, "Category is required"),
  })
  .refine(data => (data.isByHour ? data.hourPrice !== "" : data.price !== ""), {
    message: "Either 'price' or 'hourPrice' must be provided based on 'isByHour'",
    path: ["price"], // Adjust the error path as needed
  });
