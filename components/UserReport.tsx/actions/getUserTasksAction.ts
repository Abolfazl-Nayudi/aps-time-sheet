"use server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryTable, taskTable, userTable, userTaskTable } from "@/db/schema";

export const getUserTasksAction = async (userId: string) => {
  const userData = await db.select().from(userTable).where(eq(userTable.id, userId));

  const userTasksData = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, userId))
    .innerJoin(userTaskTable, eq(userTaskTable.userId, userId))
    .innerJoin(taskTable, eq(taskTable.id, userTaskTable.taskId))
    .innerJoin(categoryTable, eq(categoryTable.id, taskTable.categoryId));

  const filteredData = userTasksData.map(task => {
    const { tasks, user_tasks, categories } = task;
    const { categoryId, name: taskName, isByHour, hourPrice, price } = tasks;
    const { date, endTime, startTime, notes, id: userTaskId, userId, taskId } = user_tasks;
    const { name: categoryName } = categories;

    return {
      userId,
      categoryId,
      categoryName,
      taskId,
      taskName,
      price,
      isByHour,
      hourPrice,
      endTime,
      startTime,
      date,
      notes,
      userTaskId,
    };
  });
  const { email, firstName, id, lastName } = userData[0];

  return { status: "success", message: "", data: { taskData: filteredData, user: { id, firstName, lastName, email } } };
};
