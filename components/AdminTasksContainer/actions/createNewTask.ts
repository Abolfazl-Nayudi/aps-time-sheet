"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categoryTable, taskTable } from "@/db/schema";
import { auth } from "@/utils/authOptions";

type ArgType = {
  name: string;
  price: string | null;
  isByHour: boolean;
  hourPrice: string | null;
  categoryId: string;
};

export const createNewTask = async (data: ArgType) => {
  const { getUser } = await auth();
  const user = getUser();

  if (!user || user?.role !== "ADMIN") {
    return { status: "error", message: "unauthenticated", data: null };
  }

  const newTask = await db.insert(taskTable).values(data).returning();

  if (!newTask.length) {
    return { status: "error", message: "there is an error in creating task, try again", data: null };
  }

  const taskCategory = await db
    .select({ categoryName: categoryTable.name })
    .from(categoryTable)
    .where(eq(categoryTable.id, newTask[0].categoryId));
  return {
    status: "success",
    message: "task created successfully",
    data: { ...newTask[0], categoryName: taskCategory[0].categoryName },
  };
};
