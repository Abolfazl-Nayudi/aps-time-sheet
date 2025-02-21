"use client";

import { CircularProgress, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { snackBarStateType } from "@/types/snackBarStateType";

import SnackBarComponent from "../SnackBar";
import { CategoryStateType } from ".";
import { editCategoryAction } from "./actions/editCategoryAction";

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
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCategoryData: Dispatch<SetStateAction<CategoryStateType>>;
  selectedCategory: { id: string; name: string };
};

export default function EditCategoryModal({ open, setOpen, setCategoryData, selectedCategory }: PropsType) {
  const [categoryName, setCategoryName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackBarState, setSnackBarState] = useState<snackBarStateType>({ open: false, text: "", status: "success" });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setCategoryName("");

    if (categoryName.length > 1) {
      const { message, status, data } = await editCategoryAction({ id: selectedCategory.id, name: categoryName });

      if (status === "error" && message === "unauthenticated") {
        router.push("/");
        return;
      }

      if (status === "error") return setSnackBarState({ open: true, text: message, status: "error" });
      if (status === "success" && data) {
        setCategoryData(categories => {
          return categories.map(category => (category.id === data.id ? { ...data, count: category.count } : category));
        });
        setOpen(false);
        setSnackBarState({ open: true, text: message, status: "success" });
      }
    } else {
      setErrorMessage("the category name should be more than 1 character");
    }
    setLoading(false);
  };

  useEffect(() => {
    setCategoryName(selectedCategory.name);
  }, [selectedCategory.id]);

  return (
    <div>
      {/* <Button onClick={() => setOpen(true)}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ border: 0, outline: 0 }}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" textAlign={"center"} variant="h6" component="h2" marginBottom={2}>
            Edit Category
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box display={"flex"} flexDirection={"column"} gap={2}>
              <TextField type="text" value={categoryName} onChange={e => setCategoryName(e.target.value)} />
              <Button color="primary" variant="contained" type="submit" disabled={loading}>
                {loading ? <CircularProgress /> : "Edit"}
              </Button>
            </Box>
          </form>
          {errorMessage && (
            <Typography variant="body2" marginTop={"1rem"} color={"crimson"}>
              {errorMessage}
            </Typography>
          )}
        </Box>
      </Modal>
      <SnackBarComponent
        open={snackBarState.open}
        setOpen={setSnackBarState}
        text={snackBarState.text}
        status={snackBarState.status}
      />
    </div>
  );
}
