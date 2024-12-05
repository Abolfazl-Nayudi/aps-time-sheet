"use client";

import { Box, Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

type PropsType = {
  id: number;
  category: string;
  task: string;
  price: number | null;
  isPerHour: boolean;
  hourPrice: null | number;
};

export default function TasksTable({ tasks }: { tasks: PropsType[] }) {
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
                <TableCell align="center">َActions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks?.map(({ category, hourPrice, id, isPerHour, price, task }) => (
                <TableRow
                  key={id}
                  sx={{
                    cursor: "pointer",
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": {
                      backgroundColor: "lightgray",
                    },
                  }}
                >
                  <TableCell component="th" scope="row" align="center">
                    {category}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {task}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {price ? price : "_"}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {isPerHour ? "Yes" : "No"}
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
