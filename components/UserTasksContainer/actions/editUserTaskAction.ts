"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { userTaskTable } from "@/db/schema";
import { auth } from "@/utils/authOptions";

type userTaskDataType = {
  id: string;
  startTime: string;
  endTime: string;
  date: Date;
  notes: string | null;
  taskId: string;
};

export const editUserTaskAction = async (userTaskData: userTaskDataType) => {
  const { getUser } = await auth();
  const user = getUser();

  if (!user?.userId) {
    return { status: "error", message: "unauthenticated", data: null };
  }

  const ISOFormattedDate = userTaskData.date.toISOString().split("T")[0];

  const updatedTask = await db
    .update(userTaskTable)
    .set({ ...userTaskData, userId: user.userId, date: ISOFormattedDate })
    .where(eq(userTaskTable.id, userTaskData.id))
    .returning();

  if (!updatedTask) {
    return { status: "error", message: "failed to update task data, try again", data: null };
  }

  return { status: "success", message: "Task Created Successfully", data: updatedTask[0] };
};
