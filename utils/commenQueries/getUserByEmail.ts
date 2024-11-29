"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { userTable } from "@/db/schema";

const getUserByEmail = async (email: string) => {
  const userData = await db.selectDistinct().from(userTable).where(eq(userTable.email, email)).limit(1);
  if (userData.length > 0) {
    return userData[0];
  } else {
    null;
  }
};

export { getUserByEmail };
