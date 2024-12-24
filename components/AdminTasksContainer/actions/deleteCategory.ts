"use server";

import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { categoryTable, taskTable } from "@/db/schema";
import { auth } from "@/utils/authOptions";

export const deleteCategory = async (categoryId: string) => {
  try {
    const { getUser } = await auth();
    const user = getUser();

    if (!user || user?.role !== "ADMIN") {
      return { status: "error", message: "unauthenticated", data: null };
    }

    // Check if there are any tasks associated with the category
    const taskCount = await db
      .select({
        count: sql<number>`COUNT(${taskTable.id})`,
      })
      .from(taskTable)
      .where(eq(taskTable.categoryId, categoryId))
      .execute();

    if (taskCount[0]?.count > 0) {
      return {
        status: "error",
        message: "Cannot delete category. Tasks are associated with this category.",
        data: null,
      };
    }

    // If no tasks are associated, delete the category
    const deletedCategory = await db.delete(categoryTable).where(eq(categoryTable.id, categoryId)).returning();

    return {
      status: "success",
      message: "Category deleted successfully.",
      data: deletedCategory[0],
    };
  } catch (error) {
    console.error("Error deleting category:", error);
    return {
      status: "error",
      message: "An error occurred while trying to delete the category.",
      data: null,
    };
  }
};
