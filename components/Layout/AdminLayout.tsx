import React from "react";

import { userAuthType } from "@/types/userStateType";

import AdminNavbarComponent from "../Navbar/AdminNavbar";

export default function AdminLayout({ children, user }: { children: React.ReactNode; user: userAuthType }) {
  return (
    <>
      <AdminNavbarComponent user={user} />
      {children}
    </>
  );
}
