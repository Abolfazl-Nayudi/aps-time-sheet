"use server";

import { db } from "@/db";
import { userTable } from "@/db/schema";
import { auth } from "@/utils/authOptions";

export const getUsersList = async () => {
  const { getUser } = await auth();
  const user = getUser();

  if (!user || user?.role !== "ADMIN") {
    return { status: "error", message: "unauthenticated", data: null };
  }

  const { firstName, lastName, email, id } = userTable;

  const usersData = await db.select({ firstName, lastName, email, id }).from(userTable);

  if (!usersData) {
    return { status: "error", message: "there is an error, try again", data: null };
  }

  return { status: "success", message: "", data: usersData };
};
