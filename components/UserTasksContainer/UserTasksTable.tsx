"use client";

import { Box, Button, Tooltip, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { timeGapCalculator } from "@/utils/calculateTimeGap";

import { UserTaskDataType } from ".";
import DeleteTaskModal from "./UserDeleteTaskModal";
import UserEditTaskModal from "./UserEditTaskModal";

type StateType = {
  name: string;
  isByHour: boolean;
  categoryId: string;
  id: string;
  categoryName: string;
};

type PropsType = {
  userTasks: UserTaskDataType[];
  setUserTasks: React.Dispatch<React.SetStateAction<[] | UserTaskDataType[]>>;
};

/*

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

*/

const tableHeaders = ["Number", "Category", "Task", "Start Time", "End Time", "Duration", "Note", "Actions"];

export default function UserTasksTable({ userTasks, setUserTasks }: PropsType) {
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteTaskModalState, setDeleteTaskModalState] = useState({ open: false, taskId: "" });
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState<UserTaskDataType>({
    userId: "",
    categoryId: "",
    categoryName: "",
    taskId: "",
    taskName: "",
    isByHour: false,
    endTime: "",
    startTime: "",
    date: "",
    notes: null,
    userTaskId: "",
  });

  const router = useRouter();

  const handleDeleteTask = async (userTaskId: string) => {
    setDeleteTaskModalState({ open: true, taskId: userTaskId });
    // const { data, message, status } = await deleteUserTaskAction(userTaskId);
    // if (status === "error" && message === "unauthenticated") {
    //   router.push("/");
    //   return;
    // }
    // if (status === "error") {
    //   setErrorMessage(message);
    //   return;
    // }
    // if (data) {
    //   const filteredTasks = userTasks.filter(task => task.userTaskId !== data.id);
    //   setUserTasks(filteredTasks);
    //   setOpenSnackBar(true);
    // }
  };

  let previousDate = "";

  return (
    <Box component={"section"} display={"flex"} justifyContent={"center"}>
      <Box
        width={1200}
        sx={{
          overflowX: "auto",
          boxShadow: `0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);`,
        }}
      >
        {errorMessage && (
          <Typography variant="body2" color={"crimson"}>
            {errorMessage}
          </Typography>
        )}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 1200, boxShadow: "none" }} aria-label="simple table">
            <TableHead>
              <TableRow>
                {tableHeaders.map((title, i) => {
                  return (
                    <TableCell align="center" key={i}>
                      {title}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {userTasks?.map(
                (
                  {
                    categoryName,
                    categoryId,
                    taskName,
                    date,
                    endTime,
                    notes,
                    startTime,
                    userTaskId,
                    isByHour,
                    taskId,
                    userId,
                  },
                  index,
                ) => {
                  const isNewDate = previousDate !== date;
                  previousDate = date;
                  const solarDate = new Intl.DateTimeFormat("fa-IR").format(new Date(previousDate));

                  return (
                    <>
                      {isNewDate && (
                        <TableRow>
                          <TableCell
                            colSpan={tableHeaders.length}
                            sx={{ fontWeight: "bold", fontSize: 18, textAlign: "center" }}
                          >
                            {previousDate} | {solarDate}
                          </TableCell>
                        </TableRow>
                      )}

                      <TableRow
                        key={userTaskId}
                        sx={{
                          cursor: "pointer",
                          "&:last-child td, &:last-child th": { border: 0 },
                          "&:hover": {
                            backgroundColor: "lightgray",
                          },
                        }}
                      >
                        <TableCell component="td" scope="row" align="center">
                          {index + 1}
                        </TableCell>
                        <TableCell component="td" scope="row" align="center">
                          {categoryName}
                        </TableCell>
                        <TableCell component="td" scope="row" align="center">
                          {taskName}
                        </TableCell>

                        <TableCell component="td" scope="row" align="center">
                          {startTime ? startTime : "_"}
                        </TableCell>
                        <TableCell component={"td"} align="center">
                          {endTime ? endTime : "_"}
                        </TableCell>
                        <TableCell component={"td"} align="center">
                          {startTime && endTime ? timeGapCalculator(startTime, endTime).data : "_"}
                        </TableCell>
                        <TableCell component={"td"} align="center">
                          {/* {notes} */}
                          {!notes ? (
                            "_"
                          ) : notes.length >= 10 ? (
                            <Tooltip title={notes} placement="top" arrow>
                              <Typography>{`${notes.slice(0, 10)}...`}</Typography>
                            </Tooltip>
                          ) : (
                            notes
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            color="primary"
                            variant="contained"
                            sx={{ marginRight: 2 }}
                            onClick={() => {
                              setEditModalData({
                                categoryName,
                                categoryId,
                                taskName,
                                date,
                                endTime,
                                notes,
                                startTime,
                                userTaskId,
                                isByHour,
                                taskId,
                                userId,
                              });
                              setEditTaskModalOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button color="error" variant="contained" onClick={() => handleDeleteTask(userTaskId)}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                },
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <DeleteTaskModal
        deleteTaskModalState={deleteTaskModalState}
        setDeleteTaskModalState={setDeleteTaskModalState}
        userTasks={userTasks}
        setUserTasks={setUserTasks}
      />
      <UserEditTaskModal
        open={editTaskModalOpen}
        setOpen={setEditTaskModalOpen}
        dataToUpdate={editModalData}
        setDataToUpdate={setEditModalData}
        userTasks={userTasks}
        setUserTasks={setUserTasks}
      />
    </Box>
  );
}
