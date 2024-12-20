"use server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryTable, customTaskTable, userTable } from "@/db/schema";
import { auth } from "@/utils/authOptions";

export const getUserCustomTasksAction = async (userId: string) => {
  const { getUser } = await auth();
  const user = getUser();

  if (!user?.userId && user?.role !== "ADMIN") {
    return { status: "error", message: "unauthenticated", data: null };
  }

  const userCustomTasksData = await db
    .select()
    .from(userTable)
    .where(eq(userTable.id, userId))
    .innerJoin(customTaskTable, eq(customTaskTable.userId, userId))
    .innerJoin(categoryTable, eq(categoryTable.id, customTaskTable.categoryId));

  const filteredData = userCustomTasksData.map(resObj => {
    const { customTask, categories } = resObj;
    const { id: customTaskId, name: customTaskName, startTime, endTime, date, categoryId, userId } = customTask;
    const { name: categoryName } = categories;

    return {
      userId,
      categoryId,
      categoryName,
      customTaskId,
      customTaskName,
      endTime,
      startTime,
      date,
      // notes,
    };
  });

  return { status: "success", message: "", data: filteredData };
};
