"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { userTable } from "@/db/schema";

import { SignupFormSchema, SignupFormValues } from "../zod/SignupFormSchema";

const insertUserData = async (data: SignupFormValues) => {
  const { success, error } = SignupFormSchema.safeParse(data);
  if (error) {
    throw new Error("failed to validate the fields");
  }

  const doesUserExists = await db.select().from(userTable).where(eq(userTable.email, data.email)).limit(1);

  if (doesUserExists.length > 0) {
    throw new Error("409"); // conflict http status code => user already exists
  }

  const hashedPassword = bcrypt.hashSync(data.password);

  const insertedData = await db.insert(userTable).values({ ...data, password: hashedPassword });
  return { status: 201, message: "user registered successfully" };
};

export { insertUserData };
