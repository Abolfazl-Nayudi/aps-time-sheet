"use server";

import { compareSync, hashSync } from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { userTable } from "@/db/schema";
import { auth } from "@/utils/authOptions";

type ActionProps = {
  oldPassword: string;
  newPassword: string;
};

export const changePasswordAction = async ({ oldPassword, newPassword }: ActionProps) => {
  try {
    const { getUser } = await auth();
    const sessionUser = getUser();

    if (!sessionUser?.userId) {
      return { status: "error", message: "unauthenticated", data: null };
    }

    const user = await db.select().from(userTable).where(eq(userTable.id, sessionUser?.userId));

    if (!user[0]) {
      return { status: "error", message: "unauthenticated", data: null };
    }

    const matchPassword = compareSync(oldPassword, user[0].password);

    if (!matchPassword) {
      return { status: "error", message: "old password is wrong", data: null };
    }
    const hasshedNewPassword = hashSync(newPassword);
    const changedPasswordResponse = await db
      .update(userTable)
      .set({ password: hasshedNewPassword })
      .where(eq(userTable.id, sessionUser.userId))
      .returning();

    if (!changedPasswordResponse) {
      return { status: "error", message: "somthing went wrong try again", data: null };
    }

    return { status: "success", message: "password changed successfully", data: null };
  } catch (error) {
    return { status: "error", message: "somthying went wrong try again", data: null };
  }
};
