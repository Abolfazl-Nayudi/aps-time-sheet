import { redirect } from "next/navigation";
import React from "react";

import { auth } from "@/utils/authOptions";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const { getUser } = await auth();
  const user = getUser();
  if (user) {
    if (user?.userId) return redirect("/");
  }

  return <>{children}</>;
}
