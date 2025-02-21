"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { userTaskTable } from "@/db/schema";
import { auth } from "@/utils/authOptions";

export const deleteUserTaskAction = async (userTaskId: string) => {
  const { getUser } = await auth();
  const user = getUser();

  if (!user || !user.userId) {
    return { status: "error", message: "unauthenticated", data: null };
  }

  const deletedUserTask = await db.delete(userTaskTable).where(eq(userTaskTable.id, userTaskId)).returning();

  if (!deletedUserTask.length) {
    return { status: "error", message: "there is an error in deleting task, try again", data: null };
  }

  return {
    status: "success",
    message: "task deleted successfully",
    data: deletedUserTask[0],
  };
};
