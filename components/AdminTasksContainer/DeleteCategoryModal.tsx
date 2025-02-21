import { Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

import { snackBarStateType } from "@/types/snackBarStateType";

import SnackBarComponent from "../SnackBar";
import { CategoryStateType } from ".";
import { deleteCategory } from "./actions/deleteCategory";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
};

type PropsType = {
  deleteCategoryModalState: {
    open: boolean;
    categoryId: string;
  };
  setDeleteCategoryModalState: Dispatch<
    SetStateAction<{
      open: boolean;
      categoryId: string;
    }>
  >;

  categoryData: CategoryStateType;
  setCategoryData: Dispatch<SetStateAction<CategoryStateType>>;
};

export default function DeleteCategoryModal({
  deleteCategoryModalState,
  setDeleteCategoryModalState,
  categoryData,
  setCategoryData,
}: PropsType) {
  const router = useRouter();

  const [snackBarState, setSnackBarState] = useState<snackBarStateType>({ open: false, text: "", status: "success" });

  const handleDeleteClick = async () => {
    try {
      const { data, message, status } = await deleteCategory(deleteCategoryModalState.categoryId);
      if (status === "error" && message === "unauthenticated") {
        router.push("/");
        return;
      }
      if (status === "error") {
        setSnackBarState({ open: true, text: message, status: "error" });
        setDeleteCategoryModalState({ open: false, categoryId: "" });
        return;
      }
      if (data) {
        const filteredCategory = categoryData.filter(category => category.id !== data.id);
        setCategoryData(filteredCategory);
        setDeleteCategoryModalState({ open: false, categoryId: "" });
        setSnackBarState({ open: true, status: "success", text: message });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSnackBarState({ open: true, status: "error", text: error.message });
      }
    }
  };

  return (
    <div>
      <Modal
        open={deleteCategoryModalState.open}
        onClose={() => {
          setDeleteCategoryModalState({ open: false, categoryId: "" });
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" textAlign={"center"} variant="h6" component="h2">
            Are You Sure?
          </Typography>

          <Stack direction={"row"} gap={2} justifyContent={"center"} marginTop={"2rem"}>
            <Button variant="contained" color="error" onClick={handleDeleteClick}>
              Delete
            </Button>
            <Button variant="contained" onClick={() => setDeleteCategoryModalState({ open: false, categoryId: "" })}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
      <SnackBarComponent
        open={snackBarState.open}
        setOpen={setSnackBarState}
        status={snackBarState.status}
        text={snackBarState.text}
      />
    </div>
  );
}
