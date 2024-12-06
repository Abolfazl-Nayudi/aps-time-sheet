import { redirect } from "next/navigation";
import React from "react";

import TaskContainer from "@/components/TasksContainer";
import { auth } from "@/utils/authOptions";

export default async function page() {
  const { getUser } = await auth();
  const user = getUser();
  if (!user || user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <>
      <TaskContainer />
    </>
  );
}
