"use server";

import { db } from "@/db";
import { taskTable } from "@/db/schema";
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

  console.log("in server action", data);

  if (!user || user?.role !== "ADMIN") {
    return { status: "error", message: "unauthenticated", data: null };
  }

  const newCategory = await db.insert(taskTable).values(data);

  if (!newCategory.rowCount) {
    return { status: "error", message: "there is an error, try again", data: null };
  }
  console.log("new category", newCategory);

  return { status: "success", message: "category created successfully", data: null };
};
