"use client";

import { Box, Button, Typography } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { snackBarStateType } from "@/types/snackBarStateType";

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
  categoryData: { name: string; id: string }[] | [];
};

export default function CategoryTable({ categoryData }: PropsType) {
  const [errorMessage, setErrorMessage] = useState("");
  const [snackBarState, setSnackBarState] = useState<snackBarStateType>({ open: false, text: "", status: "success" });

  const router = useRouter();

  const handleDeleteCategory = async () => {
    // const { data, message, status } = await deleteTaskAction(taskId);
    // if (status === "error" && message === "unauthenticated") {
    //   router.push("/");
    //   return;
    // }
    // if (status === "error") {
    //   setSnackBarState({ open: true, status: "error", text: message });
    //   return;
    // }
    // if (data) {
    //   const filteredTasks = tasks.filter(task => task.taskId !== data.id);
    //   setTasks(filteredTasks);
    //   setSnackBarState({ open: true, status: "success", text: message });
    // }
  };

  return (
    <Box component={"section"} display={"flex"} justifyContent={"center"} marginTop={"4rem"}>
      <Box width={900}>
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
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categoryData?.map(({ name, id }) => (
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
                    {name}
                  </TableCell>
                  <TableCell align="center">
                    <Button color="primary" variant="contained" sx={{ marginRight: 2 }}>
                      Edit
                    </Button>
                    <Button color="error" variant="contained" onClick={() => handleDeleteCategory()}>
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
