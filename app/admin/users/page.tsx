import { Box } from "@mui/material";
import { redirect } from "next/navigation";

import AdminUsersList from "@/components/AdminUserList";
import SignupForm from "@/components/SignupForm";
import { auth } from "@/utils/authOptions";

const UsersPage = async () => {
  const session = await auth();
  const user = session.getUser();
  if (!user || user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <>
      <SignupForm type="ADMIN" />
      <Box marginBottom={5} />
      <AdminUsersList />
    </>
  );
};

export default UsersPage;
