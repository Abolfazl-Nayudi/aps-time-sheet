import { Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

import { snackBarStateType } from "@/types/snackBarStateType";

import SnackBarComponent from "../SnackBar";
import { UserTaskDataType } from ".";
import { deleteUserTaskAction } from "./actions/deleteUserTaskAction";

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
  deleteTaskModalState: {
    open: boolean;
    taskId: string;
  };
  userTasks: UserTaskDataType[];
  setDeleteTaskModalState: Dispatch<
    SetStateAction<{
      open: boolean;
      taskId: string;
    }>
  >;
  setUserTasks: Dispatch<SetStateAction<UserTaskDataType[] | []>>;
};

export default function DeleteTaskModal({
  deleteTaskModalState,
  userTasks,
  setDeleteTaskModalState,
  setUserTasks,
}: PropsType) {
  const router = useRouter();

  const [snackBarState, setSnackBarState] = useState<snackBarStateType>({ open: false, text: "", status: "success" });

  const handleDeleteClick = async () => {
    const { data, message, status } = await deleteUserTaskAction(deleteTaskModalState.taskId);
    if (status === "error" && message === "unauthenticated") {
      router.push("/");
      return;
    }
    if (status === "error") {
      setSnackBarState({ open: true, text: message, status: "error" });
      setDeleteTaskModalState({ open: false, taskId: "" });
      return;
    }
    if (data) {
      const filteredTasks = userTasks.filter(task => task.userTaskId !== data.id);
      setUserTasks(filteredTasks);
      setDeleteTaskModalState({ open: false, taskId: "" });
      setSnackBarState({ open: true, status: "success", text: "task deleted successfully" });
    }
  };

  return (
    <div>
      <Modal
        open={deleteTaskModalState.open}
        onClose={() => {
          setDeleteTaskModalState({ open: false, taskId: "" });
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
            <Button variant="contained" onClick={() => setDeleteTaskModalState({ open: false, taskId: "" })}>
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
