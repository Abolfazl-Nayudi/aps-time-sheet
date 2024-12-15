"use client";

import { Box, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useState } from "react";

import { timeGapCalculator } from "@/utils/calculateTimeGap";

import SnackBarComponent from "../SnackBar";
import { CustomTaskDataType } from ".";

type PropsType = {
  userCustomTasks: CustomTaskDataType[];
};

export default function UserCustomTasksTable({ userCustomTasks }: PropsType) {
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);

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
                <TableCell align="center">Custom Task</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Start Time</TableCell>
                <TableCell align="center">End Time</TableCell>
                <TableCell align="center">Duration</TableCell>
                <TableCell align="center">Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userCustomTasks?.map(({ categoryName, customTaskId, customTaskName, date, endTime, startTime }) => (
                <TableRow
                  key={customTaskId}
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
                    {customTaskName}
                  </TableCell>
                  <TableCell component="td" scope="row" align="center">
                    {date}
                  </TableCell>
                  <TableCell component="td" scope="row" align="center">
                    {startTime}
                  </TableCell>
                  <TableCell component={"td"} align="center">
                    {endTime}
                  </TableCell>
                  <TableCell component={"td"} align="center">
                    {startTime && endTime ? timeGapCalculator(startTime, endTime).data : "_"}
                  </TableCell>
                  <TableCell component={"td"} align="center">
                    {/* {notes} */}_
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <SnackBarComponent open={openSnackBar} setOpen={setOpenSnackBar} text={`task deleted successfully`} />
    </Box>
  );
}
