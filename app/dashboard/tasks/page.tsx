import { redirect } from "next/navigation";

import UserTasksContainer from "@/components/UserTasksContainer";
import { auth } from "@/utils/authOptions";

const UserTasksPage = async () => {
  const { getUser } = await auth();
  const user = getUser();

  if (!user || !user?.userId) {
    redirect("/");
  }

  return (
    <>
      <UserTasksContainer />
    </>
  );
};

export default UserTasksPage;
