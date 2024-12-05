"use server";

import { db } from "@/db";
import { categoryTable } from "@/db/schema";
import { auth } from "@/utils/authOptions";

export const createNewCategory = async (name: string) => {
  const { getUser } = await auth();
  const user = getUser();

  if (!user || user?.role !== "ADMIN") {
    return { status: "error", message: "unauthenticated", data: null };
  }

  const newCategory = await db.insert(categoryTable).values({ name });

  if (!newCategory.rowCount) {
    return { status: "error", message: "there is an error, try again", data: null };
  }
  console.log("new category", newCategory);

  return { status: "success", message: "category created successfully", data: null };
};
