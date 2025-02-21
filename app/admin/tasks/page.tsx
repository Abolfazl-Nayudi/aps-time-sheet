import { redirect } from "next/navigation";
import React from "react";

import AdminTaskContainer from "@/components/AdminTasksContainer";
import { auth } from "@/utils/authOptions";

export default async function page() {
  const { getUser } = await auth();
  const user = getUser();
  if (!user || user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <>
      <AdminTaskContainer />
    </>
  );
}
