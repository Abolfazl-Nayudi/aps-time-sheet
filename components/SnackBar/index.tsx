import Alert from "@mui/material/Alert";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import * as React from "react";

import { snackBarStateType } from "@/types/snackBarStateType";

type PropsType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<snackBarStateType>>;
  text: string;
  status?: "error" | "info" | "success" | "warning";
};

export default function SnackBarComponent({ open, setOpen, text, status = "success" }: PropsType) {
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen({ open: false, status: "success", text: "" });
  };

  return (
    <div>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={status} variant="filled" sx={{ width: "100%" }}>
          {text}
        </Alert>
      </Snackbar>
    </div>
  );
}
