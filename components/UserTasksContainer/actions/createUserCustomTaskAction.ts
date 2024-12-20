"use server";

import { db } from "@/db";
import { customTaskTable } from "@/db/schema";
import { auth } from "@/utils/authOptions";

type userTaskDataType = {
  name: string;
  startTime: string;
  endTime: string;
  date: Date;
  notes: string;
  categoryId: string;
};

export const createUserCustomTaskAction = async (userCustomTaskData: userTaskDataType) => {
  const { getUser } = await auth();
  const user = getUser();

  if (!user?.userId) {
    return { status: "error", message: "unauthenticated", data: null };
  }

  const ISOFormattedDate = userCustomTaskData.date.toISOString().split("T")[0];

  const storedTask = await db
    .insert(customTaskTable)
    .values({ ...userCustomTaskData, userId: user.userId, date: ISOFormattedDate })
    .returning();

  if (!storedTask) {
    return { status: "error", message: "failed to store task data, try again", data: null };
  }

  return { status: "success", message: "task stored successfully", data: storedTask[0] };
};
