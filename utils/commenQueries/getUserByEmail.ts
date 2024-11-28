"use server";

import { drizzle } from "drizzle-orm/node-postgres";
import { userTable } from "@/db/schema";
import { eq } from "drizzle-orm";
const db = drizzle(process.env.DATABASE_URL as string);

const getUserByEmail = async (email: string) => {
  const userData = await db.selectDistinct().from(userTable).where(eq(userTable.email, email)).limit(1);
  if (userData.length > 0) {
    return userData[0];
  } else {
    null;
  }
};

export { getUserByEmail };
