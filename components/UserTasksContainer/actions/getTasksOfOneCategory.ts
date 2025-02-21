"use server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryTable, taskTable } from "@/db/schema";

const getTasksOfOneCategory = async (categoryId: string) => {
  const tasks = await db
    .select()
    .from(categoryTable)
    .where(eq(categoryTable.id, categoryId))
    .innerJoin(taskTable, eq(taskTable.categoryId, categoryTable.id));

  if (!tasks) {
    return { status: "error", message: "failed to get Tasks for selected category, try again", data: null };
  }

  const tasksArray = tasks.map(tasksObj => {
    const { categoryId, isByHour, name, id } = tasksObj.tasks;
    return { categoryId, isByHour, name, id };
  });
  return { status: "success", message: "", data: tasksArray };
};

export { getTasksOfOneCategory };
