// "use client";

import React from "react";

import { auth } from "@/utils/authOptions";

import AdminLayout from "./AdminLayout";
import UserLayout from "./UserLayout";

export default async function FrontLayout({ children }: { children: React.ReactNode }) {
  // const [user, setUser] = useState<userStateType>({ userId: "", role: "" });
  // console.log("in state", user);
  // auth().then(({ getUser }) => {
  //   const user = getUser();
  //   setUser({ ...user });
  // });
  // const session = useSession();
  // useEffect(() => {
  //   if (session.status === "unauthenticated") {
  //     signOut({ callbackUrl: "/" });
  //   }
  // }, []);

  const { getUser } = await auth();
  const user = getUser();

  if (user?.role === "ADMIN") {
    return (
      <>
        <AdminLayout user={user}>{children}</AdminLayout>
      </>
    );
  }

  return <UserLayout user={user!}>{children}</UserLayout>;
}
