"use server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryTable, taskTable, userTable, userTaskTable } from "@/db/schema";
import { auth } from "@/utils/authOptions";

export const getUserTasksAction = async () => {
  const { getUser } = await auth();
  const user = getUser();

  if (!user?.userId) {
    return { status: "error", message: "unauthenticated", data: null };
  }

  const userTasksData = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, user.userId))
    .innerJoin(userTaskTable, eq(userTaskTable.userId, user.userId))
    .innerJoin(taskTable, eq(taskTable.id, userTaskTable.taskId))
    .innerJoin(categoryTable, eq(categoryTable.id, taskTable.categoryId));

  const filteredData = userTasksData.map(task => {
    const { tasks, user_tasks, categories } = task;

    const { categoryId, name: taskName, isByHour } = tasks;
    const { date, endTime, startTime, notes, taskId, userId } = user_tasks;
    const { name: categoryName } = categories;

    return { userId, categoryId, categoryName, taskId, taskName, isByHour, endTime, startTime, date, notes };
  });

  return { status: "success", message: "", data: filteredData };
};
