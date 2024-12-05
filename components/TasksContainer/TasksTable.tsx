"use client";

import { Box, Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import { TaskDataType } from ".";

export default function TasksTable({ tasks }: { tasks: TaskDataType[] }) {
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
                    <Button color="primary" variant="contained" sx={{ marginRight: 2 }}>
                      Edit
                    </Button>
                    <Button color="error" variant="contained">
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
