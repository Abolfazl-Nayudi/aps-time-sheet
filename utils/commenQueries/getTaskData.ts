"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryTable, taskTable } from "@/db/schema";

export const getTaskData = async () => {
  const { id, categoryId, price, isByHour, hourPrice, name } = taskTable;

  const taskData = await db
    .select({
      taskId: id,
      categoryId,
      price,
      isByHour,
      hourPrice,
      taskName: name,
      categoryName: categoryTable.name,
    })
    .from(taskTable)
    .innerJoin(categoryTable, eq(taskTable.categoryId, categoryTable.id));

  if (!taskData) {
    return { status: "error", message: "failed to get tasks data, please try again", data: null };
  }

  return { status: "success", message: "category created successfully", data: taskData };
};
