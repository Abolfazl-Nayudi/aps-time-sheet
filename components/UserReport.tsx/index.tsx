"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { compareAsc, parse, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { appendToSheetAction } from "@/utils/appendToSheetAction";
import { calculateSalary } from "@/utils/calclulateSalary";

import { getUserCustomTasksAction } from "./actions/getUserCustomTaskAction";
import { getUserTasksAction } from "./actions/getUserTasksAction";
import UserInformation from "./actions/UserInformation";
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

export type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

const UserReport = ({ userId }: { userId: string }) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const router = useRouter();

  const [userTasks, setUserTasks] = useState<UserTaskDataType[] | []>([]);
  const [userCustomTasks, setUserCustomTasks] = useState<CustomTaskDataType[] | []>([]);
  const [user, setUser] = useState<UserData | null>(null);
  const [salary, setSalary] = useState("");
  const [filterDate, setFilterDate] = useState({
    startDate: today,
    endDate: tomorrow,
  });
  const [filteredTaskData, setFilteredTaskData] = useState<{ active: boolean; tasks: UserTaskDataType[] | [] }>({
    active: false,
    tasks: [],
  });
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

  const handleExportClick = async () => {
    try {
      const res = await appendToSheetAction(userTasks);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilterDate = () => {
    const { startDate, endDate } = filterDate;
    if (startDate && endDate) {
      const tasks = userTasks.filter(task => {
        const taskDate = parseISO(task.date);
        return taskDate >= startDate && taskDate <= endDate;
      });

      setFilteredTaskData({ active: true, tasks });
    }
  };

  return (
    <>
      <Box component={"section"} marginY={10}>
        {user && <UserInformation {...user} />}
        <Box padding={"1rem"} border={"1px solid lightgray"} borderRadius={"5px"} width={900} margin={"2rem auto 0"}>
          <Stack direction={"row"} justifyContent={"space-evenly"} alignItems={"center"}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={filterDate.startDate}
                onChange={newValue => {
                  if (newValue) {
                    setFilterDate(data => ({ ...data, startDate: newValue }));
                  }
                }}
              />
              <DatePicker
                label="End Date"
                value={filterDate.endDate}
                onChange={newValue => {
                  if (newValue) {
                    setFilterDate(data => ({ ...data, endDate: newValue }));
                  }
                }}
              />
            </LocalizationProvider>
            <Button variant="contained" sx={{ textTransform: "none", fontSize: 20 }} onClick={handleFilterDate}>
              Filter
            </Button>
          </Stack>

          <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} marginTop={"2rem"}>
            <Typography variant="h5">Number Of Tasks: {userTasks.length}</Typography>
            <Typography variant="h5">Number Of Custom Tasks: {userCustomTasks.length}</Typography>

            {salary && (
              <Typography variant="h5" textAlign={"center"} color={"green"}>
                Salary: {salary}
              </Typography>
            )}
          </Stack>
          <Stack direction={"row"} justifyContent={"center"} marginTop={"2rem"}>
            <Button onClick={handleExportClick} variant="contained">
              Export
            </Button>
          </Stack>
        </Box>

        <Box display={"flex"} justifyContent={"center"} marginTop={5}></Box>
        <Box marginTop={"4rem"}>
          <Typography variant="h4" textAlign={"center"} marginBottom={"1rem"}>
            Tasks
          </Typography>
          <UserTasksTable userTasks={filteredTaskData.active ? filteredTaskData.tasks : userTasks} />
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
