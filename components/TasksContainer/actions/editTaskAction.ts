"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { taskTable } from "@/db/schema";
import { auth } from "@/utils/authOptions";

import { PropsType } from "../EditTaskModal";

export const editTaskAction = async (taskData: PropsType["taskData"]) => {
  console.log("in action", taskData);
  const { getUser } = await auth();
  const user = getUser();

  if (!user || user?.role !== "ADMIN") {
    return { status: "error", message: "unauthenticated", data: null };
  }

  const { id, ...restOfTaskData } = taskData;

  const updatedTask = await db.update(taskTable).set(restOfTaskData).where(eq(taskTable.id, id)).returning();

  console.log("updatedTask", updatedTask);
  if (!updatedTask.length) {
    return { status: "error", message: "there is an error in edtting task, try again", data: null };
  }

  return { status: "success", message: "task updated successfully", data: updatedTask[0] };
};
