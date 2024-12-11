"use client";

import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getUserTasksAction } from "./actions/getUserTasksAction";
import UserAddTaskModal from "./UserAddTaskModal";

export type UserTaskDataType = {
  userId: string;
  categoryId: string;
  categoryName: string;
  taskId: string;
  taskName: string;
  isByHour: boolean;
  endTime: string;
  startTime: string;
  date: string;
  notes: string | null;
};

const UserTasksContainer = () => {
  const router = useRouter();

  const [openUserAddTaskModal, setOpenUserAddTaskModal] = useState(false);
  const [userTasks, setUserTasks] = useState<UserTaskDataType[] | []>([]);
  const [errorMessage, setErrorMessage] = useState("");
  console.log(userTasks);
  useEffect(() => {
    (async () => {
      const { data, message, status } = await getUserTasksAction();

      if (status === "error" && message === "unauthenticated") {
        router.push("/");
        return;
      }

      if (status === "error") {
        setErrorMessage(message);
      }

      if (data) {
        setUserTasks(data);
      }
    })();
  }, []);

  return (
    <>
      <Box component={"section"}>
        <Box>
          <Button variant="contained" onClick={() => setOpenUserAddTaskModal(true)}>
            Add Task
          </Button>
        </Box>
        <Box>
          {errorMessage && (
            <Typography variant="body2" color={"crimson"}>
              {errorMessage}
            </Typography>
          )}
        </Box>
        <UserAddTaskModal
          open={openUserAddTaskModal}
          setOpen={setOpenUserAddTaskModal}
          userTasks={userTasks}
          setUserTasks={setUserTasks}
        />
      </Box>
    </>
  );
};

export default UserTasksContainer;
