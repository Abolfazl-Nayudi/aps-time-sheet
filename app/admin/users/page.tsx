import { redirect } from "next/navigation";

import AdminUsersList from "@/components/AdminUserList";
import { auth } from "@/utils/authOptions";

const UsersPage = async () => {
  const session = await auth();
  const user = session.getUser();
  if (!user || user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <>
      <AdminUsersList />
    </>
  );
};

export default UsersPage;
