"use server";

import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import { categoryTable, taskTable, userTaskTable } from "@/db/schema";

export const getTaskData = async () => {
  try {
    const taskData = await db
      .select({
        taskId: taskTable.id,
        categoryId: taskTable.categoryId,
        price: taskTable.price,
        isByHour: taskTable.isByHour,
        hourPrice: taskTable.hourPrice,
        taskName: taskTable.name,
        categoryName: categoryTable.name,
        count: sql<number>`COUNT(${userTaskTable.id})`, // Count user tasks for each task
      })
      .from(taskTable)
      .leftJoin(userTaskTable, eq(taskTable.id, userTaskTable.taskId))
      .innerJoin(categoryTable, eq(taskTable.categoryId, categoryTable.id))
      .groupBy(
        taskTable.id, // Group by task ID
        categoryTable.id, // Group by category ID
        taskTable.categoryId, // Ensure proper grouping
        taskTable.price,
        taskTable.isByHour,
        taskTable.hourPrice,
        taskTable.name,
        categoryTable.name,
      ); // Include all selected fields in GROUP BY to avoid SQL errors

    // Ensure no null values and transform `count` to a number
    const updatedTaskData = taskData.map(task => ({
      ...task,
      count: Number(task.count || 0),
    }));

    return {
      status: "success",
      message: "Tasks data retrieved successfully.",
      data: updatedTaskData,
    };
  } catch (error) {
    console.error("Error fetching task data:", error);
    return {
      status: "error",
      message: "Failed to get tasks data, please try again.",
      data: null,
    };
  }
};
