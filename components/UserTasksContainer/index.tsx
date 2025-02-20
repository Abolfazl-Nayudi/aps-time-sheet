"use client";

import { Box, Button, Typography } from "@mui/material";
import { compareAsc, parse, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getUserCustomTasksAction } from "./actions/getUserCustomTaskAction";
import { getUserTasksAction } from "./actions/getUserTasksAction";
import UserAddTaskModal from "./UserAddTaskModal";
import UserTasksTable from "./UserTasksTable";

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
  userTaskId: string;
};

export type CustomTaskDataType = {
  userId: string;
  categoryId: string;
  categoryName: string;
  customTaskId: string;
  customTaskName: string;
  endTime: string;
  startTime: string;
  date: string;
};

const UserTasksContainer = () => {
  const router = useRouter();

  const [openUserAddTaskModal, setOpenUserAddTaskModal] = useState(false);
  const [openUserAddCustomTaskModal, setOpenUserAddCustomTaskModal] = useState(false);
  const [userTasks, setUserTasks] = useState<UserTaskDataType[] | []>([]);
  const [userCustomTasks, setUserCustomTasks] = useState<CustomTaskDataType[] | []>([]);
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    (async () => {
      // user tasks
      const { data, message, status } = await getUserTasksAction();

      if (status === "error" && message === "unauthenticated") {
        router.push("/");
        return;
      }

      if (status === "error") {
        setErrorMessage(message);
      }

      if (data) {
        const sortedTaskData = data.sort((a, b) => {
          const dateComparison = compareAsc(parseISO(a.date), parseISO(b.date));
          if (dateComparison !== 0) return dateComparison;

          // Parse and compare startTime
          const timeA = parse(a.startTime, "HH:mm", new Date());
          const timeB = parse(b.startTime, "HH:mm", new Date());
          return compareAsc(timeA, timeB);
        });

        setUserTasks(sortedTaskData);
      }

      // user custom tasks
      const {
        data: customTaskData,
        message: customTaskMessage,
        status: customTaskStatus,
      } = await getUserCustomTasksAction();

      if (customTaskStatus === "error" && customTaskMessage === "unauthenticated") {
        router.push("/");
        return;
      }

      if (customTaskStatus === "error") {
        setErrorMessage(customTaskMessage);
      }

      if (customTaskData) {
        // const sortedCustomTaskData = customTaskData.sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date)));

        const sortedCustomTaskData = customTaskData.sort((a, b) => {
          const dateComparison = compareAsc(parseISO(a.date), parseISO(b.date));
          if (dateComparison !== 0) return dateComparison;

          // Parse and compare startTime
          const timeA = parse(a.startTime, "HH:mm", new Date());
          const timeB = parse(b.startTime, "HH:mm", new Date());
          return compareAsc(timeA, timeB);
        });

        setUserCustomTasks(sortedCustomTaskData);
      }
    })();
  }, []);

  return (
    <>
      <Box component={"section"} marginBottom={10}>
        <Box display={"flex"} justifyContent={"center"} marginTop={"4rem"} gap={"10px"}>
          <Button variant="contained" onClick={() => setOpenUserAddTaskModal(true)}>
            Add Task
          </Button>
          {/* <Button
            variant="contained"
            onClick={() => setOpenUserAddCustomTaskModal(true)}
          >
            Add Custom Task
          </Button> */}
        </Box>
        <Box marginTop={"4rem"}>
          <Typography variant="h4" textAlign={"center"} marginBottom={"1rem"}>
            Tasks
          </Typography>
          <UserTasksTable userTasks={userTasks} setUserTasks={setUserTasks} />
          {errorMessage && (
            <Typography variant="body2" color={"crimson"}>
              {errorMessage}
            </Typography>
          )}
        </Box>
        {/* <Box marginTop={"4rem"}>
          <Typography variant="h4" textAlign={"center"} marginBottom={"1rem"}>
            Custom Tasks
          </Typography>
          <UserCustomTasksTable userCustomTasks={userCustomTasks} setUserCustomTasks={setUserCustomTasks} />
          {errorMessage && (
            <Typography variant="body2" color={"crimson"}>
              {errorMessage}
            </Typography>
          )}
        </Box> */}
        <UserAddTaskModal
          open={openUserAddTaskModal}
          setOpen={setOpenUserAddTaskModal}
          userTasks={userTasks}
          setUserTasks={setUserTasks}
        />
        {/* <UserAddCustomTaskModal
          open={openUserAddCustomTaskModal}
          setOpen={setOpenUserAddCustomTaskModal}
          userCustomTasks={userCustomTasks}
          setUserCustomTasks={setUserCustomTasks}
        /> */}
      </Box>
    </>
  );
};

export default UserTasksContainer;
