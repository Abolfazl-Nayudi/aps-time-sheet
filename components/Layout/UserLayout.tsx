import React from "react";

import { userAuthType } from "@/types/userStateType";

import UserNavbarComponent from "../Navbar/UserNavbar";

export default function UserLayout({ children, user }: { children: React.ReactNode; user: userAuthType }) {
  return (
    <>
      <UserNavbarComponent user={user} />
      {children}
    </>
  );
}
