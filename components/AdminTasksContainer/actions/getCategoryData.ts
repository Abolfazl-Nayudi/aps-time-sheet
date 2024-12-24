"use server";

import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { categoryTable, taskTable } from "@/db/schema";

export const getCategoryData = async () => {
  // const categoryData = await db.select().from(categoryTable);

  const categoriesWithCount = await db
    .select({
      id: categoryTable.id,
      name: categoryTable.name,
      count: sql<number>`COUNT(${taskTable.id})`,
    })
    .from(categoryTable)
    .leftJoin(taskTable, eq(categoryTable.id, taskTable.categoryId))
    .groupBy(categoryTable.id);

  if (!categoriesWithCount) {
    return { status: "error", message: "Failed to get categories, try again", data: null };
  }

  const updatedData = categoriesWithCount.map(category => ({ ...category, count: Number(category.count) }));
  return { status: "success", message: "", data: updatedData };
};
