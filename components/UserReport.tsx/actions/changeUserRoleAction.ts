"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { userTable } from "@/db/schema";
import { roleEnum } from "@/types/roleEnumType";
import { auth } from "@/utils/authOptions";

export const changeUserRoleAction = async (userId: string, role: roleEnum) => {
  const { getUser } = await auth();
  const user = getUser();

  if (!user?.userId && user?.role !== "ADMIN") {
    return { status: "error", message: "unauthenticated", data: null };
  }

  if (user.userId === userId) {
    return { status: "error", message: "You cannot change your role", data: null };
  }

  const res = await db
    .update(userTable)
    .set({ role: role === "ADMIN" ? "USER" : "ADMIN" })
    .where(eq(userTable.id, userId))
    .returning();

  if (!res[0]) {
    return { status: "error", message: "there is an error in changing user role, try again", data: null };
  }

  console.log(res[0]);
  return { status: "success", message: "user role changed successfully", data: res[0] };
};
