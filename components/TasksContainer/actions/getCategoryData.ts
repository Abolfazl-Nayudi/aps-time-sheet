"use server";

import { db } from "@/db";
import { categoryTable } from "@/db/schema";

export const getCategoryData = async () => {
  const categoryData = await db.select().from(categoryTable);

  if (!categoryData) {
    return { status: "error", message: "Failed to get categories, try again", data: null };
  }

  return { status: "success", message: "", data: categoryData };
};
