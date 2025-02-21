import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, InputLabel, MenuItem, Select, Switch, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { snackBarStateType } from "@/types/snackBarStateType";
import { AdminAddTaskFormSchema } from "@/utils/zod/AdminAddTaskFormSchema";

import SnackBarComponent from "../SnackBar";
import { TaskDataType } from ".";
import { editTaskAction } from "./actions/editTaskAction";

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

export type PropsType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  taskData: {
    id: string;
    name: string;
    price: string | null;
    isByHour: boolean;
    hourPrice: string | null;
    categoryId: string;
    categoryName: string;
  };
  setTasks: React.Dispatch<React.SetStateAction<[] | TaskDataType[]>>;
  categoryData: { name: string; id: string }[] | [];
};

export default function EditTaskModal({ open, setOpen, taskData, setTasks, categoryData }: PropsType) {
  const [checked, setChecked] = useState(false);
  // const [errorMessage, setErrorMessage] = useState("");
  const [snackBarState, setSnackBarState] = useState<snackBarStateType>({ open: false, text: "", status: "success" });

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(AdminAddTaskFormSchema),
    defaultValues: {
      ...taskData,
    },
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setValue("isByHour", event.target.checked);
  };

  const onSubmit = async (data: PropsType["taskData"]) => {
    const {
      data: editedTask,
      message,
      status,
    } = await editTaskAction({
      ...data,
      price: data.isByHour ? null : data.price,
      hourPrice: data.isByHour ? data.hourPrice : null,
      id: taskData.id,
    });

    if (status === "error" && message === "unauthenticated") {
      router.push("/");
      return;
    }
    if (status === "error") {
      setSnackBarState({ open: true, status: "error", text: message });

      return;
    }

    if (status !== "sucess") {
      setTasks(tasks => {
        return tasks.map(task => {
          if (task.taskId === editedTask?.id) {
            const { categoryId, hourPrice, id, isByHour, name, price } = editedTask;
            return {
              taskId: id,
              taskName: name,
              categoryId,
              price,
              hourPrice,
              isByHour,
              categoryName: taskData.categoryName,
              count: task.count,
            };
          }

          return task;
        });
      });

      reset();
      setOpen(false);
      setSnackBarState({ open: true, status: "success", text: message });
    }
  };

  useEffect(() => {
    reset(taskData); // Reset the form with new data
  }, [taskData, reset]);

  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" textAlign={"center"} marginBottom={2}>
            Add Task
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Box>
              <TextField id="name" label="Task Name" variant="outlined" {...register("name")} fullWidth />
              {errors.name && (
                <Typography marginTop={"4px"} variant="body2" color={"crimson"}>
                  {errors.name.message}
                </Typography>
              )}
            </Box>

            <Box display={"flex"} alignItems={"center"}>
              <Typography>Is By Hour:</Typography>
              <Switch
                defaultChecked={taskData.isByHour}
                onChange={handleChange}
                inputProps={{ "aria-label": "controlled" }}
              />
            </Box>
            <Box>
              <TextField
                id="price"
                type="number"
                label="Price"
                disabled={checked}
                {...register("price")}
                variant="outlined"
                fullWidth
              />
              {errors.price && (
                <Typography marginTop={"4px"} variant="body2" color={"crimson"}>
                  {errors.price.message}
                </Typography>
              )}
            </Box>
            <Box>
              <TextField
                id="hour-price"
                type="number"
                label="Hour Price"
                disabled={!checked}
                variant="outlined"
                {...register("hourPrice")}
                fullWidth
              />
              {errors.hourPrice && (
                <Typography marginTop={"4px"} variant="body2" color={"crimson"}>
                  {errors.hourPrice.message}
                </Typography>
              )}
            </Box>
            <Box>
              <FormControl fullWidth>
                <InputLabel id="category">Category</InputLabel>
                <Select
                  labelId="category"
                  id=""
                  label="category"
                  defaultValue={taskData.categoryId}
                  {...register("categoryId")}
                >
                  {categoryData?.map(({ id, name }) => {
                    return (
                      <MenuItem key={id} value={id}>
                        {name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              {errors.categoryId && (
                <Typography color={"crimson"} variant="body2">
                  {errors.categoryId.message}
                </Typography>
              )}
            </Box>
            <Box display={"flex"} flexDirection={"column"}>
              <Button type="submit" variant="contained">
                Add Task
              </Button>
            </Box>
          </form>
          {/* {errorMessage && (
            <Typography variant="body2" color={"crimson"}>
              {errorMessage}
            </Typography>
          )} */}
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
