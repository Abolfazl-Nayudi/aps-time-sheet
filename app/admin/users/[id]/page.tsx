import { redirect } from "next/navigation";
import React from "react";

import { auth } from "@/utils/authOptions";

export default async function SingleUserPage() {
  const session = await auth();
  const user = session.getUser();
  if (!user || user?.role !== "ADMIN") {
    redirect("/");
  }

  return <div>SingleUserPage</div>;
}
