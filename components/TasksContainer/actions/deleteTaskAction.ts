"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { taskTable } from "@/db/schema";
import { auth } from "@/utils/authOptions";

export const deleteTaskAction = async (taskId: string) => {
  const { getUser } = await auth();
  const user = getUser();

  if (!user || user?.role !== "ADMIN") {
    return { status: "error", message: "unauthenticated", data: null };
  }

  const deletedTask = await db.delete(taskTable).where(eq(taskTable.id, taskId)).returning();

  if (!deletedTask.length) {
    return { status: "error", message: "there is an error in deleting task, try again", data: null };
  }

  return {
    status: "success",
    message: "task deleted successfully",
    data: deletedTask[0],
  };
};
