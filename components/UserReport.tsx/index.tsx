"use client";

import { Box, Stack, Typography } from "@mui/material";
import { compareAsc, parse, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { calculateSalary } from "@/utils/calclulateSalary";

import { getUserCustomTasksAction } from "./actions/getUserCustomTaskAction";
import { getUserTasksAction } from "./actions/getUserTasksAction";
import UserCustomTasksTable from "./UserCustomTasksTable";
import UserTasksTable from "./UserTasksTable";

export type UserTaskDataType = {
  userId: string;
  categoryId: string;
  categoryName: string;
  taskId: string;
  taskName: string;
  price: string | null;
  isByHour: boolean;
  hourPrice: string | null;
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

type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

const UserReport = ({ userId }: { userId: string }) => {
  const router = useRouter();

  const [userTasks, setUserTasks] = useState<UserTaskDataType[] | []>([]);
  const [userCustomTasks, setUserCustomTasks] = useState<CustomTaskDataType[] | []>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [salary, setSalary] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    (async () => {
      // user tasks
      const { data, message, status } = await getUserTasksAction(userId);

      if (status === "error" && message === "unauthenticated") {
        router.push("/");
        return;
      }

      if (status === "error") {
        setErrorMessage(message);
      }

      if (data) {
        const sortedTaskData = data.taskData.sort((a, b) => {
          const dateComparison = compareAsc(parseISO(a.date), parseISO(b.date));
          if (dateComparison !== 0) return dateComparison;

          // Parse and compare startTime
          const timeA = parse(a.startTime, "HH:mm", new Date());
          const timeB = parse(b.startTime, "HH:mm", new Date());
          return compareAsc(timeA, timeB);
        });

        setUserTasks(sortedTaskData);
        setUser(data.user);
        setSalary(calculateSalary(data.taskData));
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
      <Box component={"section"} marginY={10}>
        <Box>
          {user && (
            <Stack direction={"row"} gap={5} justifyContent={"center"}>
              <Typography variant="h6">Email: {user?.email}</Typography>
              <Typography variant="h6">
                Full Name: {user?.firstName} {user?.lastName}
              </Typography>
            </Stack>
          )}
          {salary && (
            <Typography variant="h5" textAlign={"center"} marginTop={5}>
              Salary: {salary}{" "}
            </Typography>
          )}
        </Box>

        <Box marginTop={"4rem"}>
          <Typography variant="h4" textAlign={"center"} marginBottom={"1rem"}>
            Tasks
          </Typography>
          <UserTasksTable userTasks={userTasks} />
          {errorMessage && (
            <Typography variant="body2" color={"crimson"}>
              {errorMessage}
            </Typography>
          )}
        </Box>
        <Box marginTop={"4rem"}>
          <Typography variant="h4" textAlign={"center"} marginBottom={"1rem"}>
            Custom Tasks
          </Typography>
          <UserCustomTasksTable userCustomTasks={userCustomTasks} />
          {errorMessage && (
            <Typography variant="body2" color={"crimson"}>
              {errorMessage}
            </Typography>
          )}
        </Box>
      </Box>
    </>
  );
};

export default UserReport;
