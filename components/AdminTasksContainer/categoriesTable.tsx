"use client";

import { Box, Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Dispatch, SetStateAction, useState } from "react";

import { CategoryStateType } from ".";
import DeleteCategoryModal from "./DeleteCategoryModal";
import EditCategoryModal from "./EditCategoryModal";

// type StateType = {
//   name: string;
//   price: string | null;
//   isByHour: boolean;
//   hourPrice: string | null;
//   categoryId: string;
//   id: string;
//   categoryName: string;
// };

type PropsType = {
  categoryData: CategoryStateType;
  setCategoryData: Dispatch<SetStateAction<CategoryStateType>>;
};

export default function CategoryTable({ categoryData, setCategoryData }: PropsType) {
  // const [snackBarState, setSnackBarState] = useState<snackBarStateType>({ open: false, text: "", status: "success" });
  const [editCategoryModalOpen, setEditCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({ id: "", name: "" });
  const [deleteCategoryModalState, setDeleteCategoryModalState] = useState({ open: false, categoryId: "" });

  // const handleDeleteCategory = async () => {
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
  // };

  return (
    <Box component={"section"} display={"flex"} justifyContent={"center"} marginTop={"4rem"}>
      <Box width={900}>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Category</TableCell>
                <TableCell align="center">Number Of Associated Tasks</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categoryData?.map(({ name, id, count }) => (
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

                  <TableCell component="th" scope="row" align="center">
                    {count}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      color="primary"
                      variant="contained"
                      sx={{ marginRight: 2 }}
                      onClick={() => {
                        setSelectedCategory({ id, name });
                        setEditCategoryModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      color="error"
                      variant="contained"
                      disabled={!!count}
                      onClick={() => {
                        setDeleteCategoryModalState({ open: true, categoryId: id });
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <EditCategoryModal
        open={editCategoryModalOpen}
        setOpen={setEditCategoryModalOpen}
        setCategoryData={setCategoryData}
        selectedCategory={selectedCategory}
      />
      <DeleteCategoryModal
        deleteCategoryModalState={deleteCategoryModalState}
        setDeleteCategoryModalState={setDeleteCategoryModalState}
        setCategoryData={setCategoryData}
        categoryData={categoryData}
      />
    </Box>
  );
}
