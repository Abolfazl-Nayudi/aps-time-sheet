"use client";

import { Box, Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/navigation";
import { useState } from "react";

import SnackBarComponent from "../SnackBar";
import { TaskDataType } from ".";
import { deleteTaskAction } from "./actions/deleteTaskAction";
import EditTaskModal from "./EditTaskModal";

type StateType = {
  name: string;
  price: string | null;
  isByHour: boolean;
  hourPrice: string | null;
  categoryId: string;
  id: string;
  categoryName: string;
};

type PropsType = {
  tasks: TaskDataType[];
  setTasks: React.Dispatch<React.SetStateAction<[] | TaskDataType[]>>;
};

export default function TasksTable({ tasks, setTasks }: PropsType) {
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [editTaskModalOpen, setEditTaskModalOpen] = useState(false);
  const [editModalData, setEditModalData] = useState<StateType>({
    name: "",
    price: "",
    isByHour: false,
    hourPrice: "",
    categoryId: "",
    id: "",
    categoryName: "",
  });

  const router = useRouter();

  const handleDeleteTask = async (taskId: string) => {
    const { data, message, status } = await deleteTaskAction(taskId);

    if (status === "error" && message === "unauthenticated") {
      router.push("/");
      return;
    }

    if (status === "error") {
      setErrorMessage(message);
      return;
    }

    if (data) {
      const filteredTasks = tasks.filter(task => task.taskId !== data.id);
      setTasks(filteredTasks);
      setOpenSnackBar(true);
    }
  };

  return (
    <Box component={"section"} display={"flex"} justifyContent={"center"} marginTop={"4rem"}>
      <Box width={900}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Category</TableCell>
                <TableCell align="center">Task</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">is Per Hour</TableCell>
                <TableCell align="center">Hour Price</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks?.map(({ categoryName, hourPrice, taskId, isByHour, price, taskName, categoryId }) => (
                <TableRow
                  key={taskId}
                  sx={{
                    cursor: "pointer",
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": {
                      backgroundColor: "lightgray",
                    },
                  }}
                >
                  <TableCell component="th" scope="row" align="center">
                    {categoryName}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {taskName}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {price ? price : "_"}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {isByHour ? "Yes" : "No"}
                  </TableCell>
                  <TableCell align="center">{hourPrice ? hourPrice : "_"}</TableCell>
                  <TableCell align="center">
                    <Button
                      color="primary"
                      variant="contained"
                      sx={{ marginRight: 2 }}
                      onClick={() => {
                        setEditModalData({
                          categoryId,
                          price: price ? price : "",
                          isByHour,
                          hourPrice: hourPrice ? hourPrice : "",
                          id: taskId,
                          name: taskName,
                          categoryName,
                        });
                        setEditTaskModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button color="error" variant="contained" onClick={() => handleDeleteTask(taskId)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <EditTaskModal
        open={editTaskModalOpen}
        setOpen={setEditTaskModalOpen}
        taskData={editModalData}
        setTasks={setTasks}
      />
      <SnackBarComponent open={openSnackBar} setOpen={setOpenSnackBar} text={`task deleted successfully`} />
    </Box>
  );
}
