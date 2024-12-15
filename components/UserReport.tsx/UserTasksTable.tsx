"use client";

import { Box, Typography } from "@mui/material";
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

import SnackBarComponent from "../SnackBar";
import { UserTaskDataType } from ".";

type PropsType = {
  userTasks: UserTaskDataType[];
};

export default function UserTasksTable({ userTasks }: PropsType) {
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const router = useRouter();

  return (
    <Box component={"section"} display={"flex"} justifyContent={"center"}>
      <Box width={1000}>
        {errorMessage && (
          <Typography variant="body2" color={"crimson"}>
            {errorMessage}
          </Typography>
        )}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Category</TableCell>
                <TableCell align="center">Task</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Start Time</TableCell>
                <TableCell align="center">End Time</TableCell>
                <TableCell align="center">Duration</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Is By Hour</TableCell>
                <TableCell align="center">Hour Price</TableCell>
                <TableCell align="center">Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userTasks?.map(
                ({
                  categoryName,
                  taskName,
                  date,
                  endTime,
                  notes,
                  startTime,
                  userTaskId,
                  price,
                  isByHour,
                  hourPrice,
                }) => {
                  return (
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
                        {categoryName}
                      </TableCell>
                      <TableCell component="td" scope="row" align="center">
                        {taskName}
                      </TableCell>
                      <TableCell component="td" scope="row" align="center">
                        {date}
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
                        {price ? price : "_"}
                      </TableCell>
                      <TableCell component={"td"} align="center">
                        {isByHour ? "Yes" : "No"}
                      </TableCell>
                      <TableCell component={"td"} align="center">
                        {hourPrice ? hourPrice : "_"}
                      </TableCell>
                      <TableCell component={"td"} align="center">
                        {notes}
                      </TableCell>
                    </TableRow>
                  );
                },
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* <EditTaskModal
        open={editTaskModalOpen}
        setOpen={setEditTaskModalOpen}
        taskData={editModalData}
        setUserTasks={setUserTasks}
      /> */}
      <SnackBarComponent open={openSnackBar} setOpen={setOpenSnackBar} text={`task deleted successfully`} />
    </Box>
  );
}
