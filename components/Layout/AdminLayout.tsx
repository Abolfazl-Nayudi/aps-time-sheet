import React from "react";

import AdminNavbarComponent from "../Navbar/AdminNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNavbarComponent />
      {children}
    </>
  );
}
