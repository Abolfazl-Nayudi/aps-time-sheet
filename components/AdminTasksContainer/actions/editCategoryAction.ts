"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryTable } from "@/db/schema";
import { auth } from "@/utils/authOptions";

export const editCategoryAction = async (categoryData: { id: string; name: string }) => {
  const { getUser } = await auth();
  const user = getUser();

  if (!user || user?.role !== "ADMIN") {
    return { status: "error", message: "unauthenticated", data: null };
  }

  const { id, name } = categoryData;

  const updatedCategory = await db.update(categoryTable).set({ name }).where(eq(categoryTable.id, id)).returning();

  console.log(updatedCategory);

  if (!updatedCategory[0]) {
    return { status: "error", message: "there is an error in editing category, try again", data: null };
  }

  return { status: "success", message: "category updated successfully", data: updatedCategory[0] };
};
