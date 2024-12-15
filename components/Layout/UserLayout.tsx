import React from "react";

import UserNavbarComponent from "../Navbar/UserNavbar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UserNavbarComponent />
      {children}
    </>
  );
}
