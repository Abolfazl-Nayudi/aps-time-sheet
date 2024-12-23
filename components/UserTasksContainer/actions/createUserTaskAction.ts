"use server";

import { db } from "@/db";
import { userTaskTable } from "@/db/schema";
import { auth } from "@/utils/authOptions";

type userTaskDataType = {
  startTime: string;
  endTime: string;
  date: Date;
  notes: string;
  taskId: string;
};

export const createUserTaskAction = async (userTaskData: userTaskDataType) => {
  const { getUser } = await auth();
  const user = getUser();

  if (!user?.userId) {
    return { status: "error", message: "unauthenticated", data: null };
  }

  const ISOFormattedDate = userTaskData.date.toISOString().split("T")[0];

  const storedTask = await db
    .insert(userTaskTable)
    .values({ ...userTaskData, userId: user.userId, date: ISOFormattedDate })
    .returning();

  if (!storedTask) {
    return { status: "error", message: "failed to store task data, try again", data: null };
  }

  return { status: "success", message: "Task Created Successfully", data: storedTask[0] };
};
