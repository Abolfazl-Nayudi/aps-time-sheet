"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import React from "react";

import AdminLayout from "./AdminLayout";
import UserLayout from "./UserLayout";

export default function FrontLayout({ children }: { children: React.ReactNode }) {
  const session = useSession();
  console.log(session);

  if (usePathname()?.includes("/admin") && session.data?.user?.role === "ADMIN") {
    return (
      <>
        <AdminLayout>{children}</AdminLayout>
      </>
    );
  }

  return <UserLayout>{children}</UserLayout>;
}
