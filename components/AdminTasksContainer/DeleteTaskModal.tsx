import { Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";

import { snackBarStateType } from "@/types/snackBarStateType";

import SnackBarComponent from "../SnackBar";
import { TaskDataType } from ".";
import { deleteTaskAction } from "./actions/deleteTaskAction";

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
  tasks: TaskDataType[];
  setDeleteTaskModalState: Dispatch<
    SetStateAction<{
      open: boolean;
      taskId: string;
    }>
  >;
  setTasks: Dispatch<SetStateAction<TaskDataType[] | []>>;
};

export default function DeleteTaskModal({ deleteTaskModalState, setDeleteTaskModalState, tasks, setTasks }: PropsType) {
  const router = useRouter();

  const [snackBarState, setSnackBarState] = useState<snackBarStateType>({ open: false, text: "", status: "success" });

  const handleDeleteTask = async () => {
    const { data, message, status } = await deleteTaskAction(deleteTaskModalState.taskId);

    if (status === "error" && message === "unauthenticated") {
      router.push("/");
      return;
    }

    if (status === "error") {
      setSnackBarState({ open: true, status: "error", text: message });
      return;
    }

    if (data) {
      const filteredTasks = tasks.filter(task => task.taskId !== data.id);
      setTasks(filteredTasks);
      setSnackBarState({ open: true, status: "success", text: message });
    }
    setDeleteTaskModalState({ open: false, taskId: "" });
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
            <Button variant="contained" color="error" onClick={handleDeleteTask}>
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
