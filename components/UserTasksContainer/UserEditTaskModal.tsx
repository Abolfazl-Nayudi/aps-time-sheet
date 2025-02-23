import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { format, parse } from "date-fns";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { snackBarStateType } from "@/types/snackBarStateType";
import { timeGapCalculator } from "@/utils/calculateTimeGap";

import { getCategoriesData } from "../AdminTasksContainer/actions/getCategoriesData";
import SnackBarComponent from "../SnackBar";
import { UserTaskDataType } from ".";
import { editUserTaskAction } from "./actions/editUserTaskAction";
import { getTasksOfOneCategory } from "./actions/getTasksOfOneCategory";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
};

type PropsType = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  dataToUpdate: UserTaskDataType;
  setDataToUpdate: Dispatch<SetStateAction<UserTaskDataType>>;
  userTasks: UserTaskDataType[];
  setUserTasks: Dispatch<SetStateAction<[] | UserTaskDataType[]>>;
};

type CategoryTasksDataType = {
  categoryId: string;
  isByHour: boolean;
  name: string;
  id: string;
};

export default function UserEditTaskModal({
  open,
  setOpen,
  userTasks,
  setUserTasks,
  dataToUpdate,
  setDataToUpdate,
}: PropsType) {
  const router = useRouter();

  const formDataInitialValue = {
    selectedCategory: "",
    selectedTask: {
      categoryId: "",
      isByHour: false,
      name: "",
      id: "",
    },
    date: new Date(),
    startTime: "",
    endTime: "",
    notes: null as string | null,
  };

  const [errorMessage, setErrorMessage] = useState({
    category: "",
    task: "",
    startTime: "",
    endTime: "",
    duration: "",
    general: "",
  });
  const [categoriesData, setCategoriesData] = useState<{ id: string; name: string }[] | []>([]);
  const [categoryTasks, setCategoryTasks] = useState<CategoryTasksDataType[] | []>([]);
  const [formData, setFormData] = useState(formDataInitialValue);
  const [duration, setDuration] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [snackBarState, setSnackBarState] = useState<snackBarStateType>({ open: false, text: "", status: "success" });

  const handleSelectCategory = (event: SelectChangeEvent) => {
    setFormData(data => ({ ...data, selectedCategory: event.target.value as string }));
  };

  const handleSelectTask = (event: SelectChangeEvent) => {
    setFormData(data => ({ ...data, selectedTask: JSON.parse(event.target.value) }));
  };

  const handleDuration = (value: string, type: "end" | "start") => {
    const durationType = type === "start" ? "startTime" : "endTime";

    const parsed = parse(value, "HH:mm", new Date());
    if (isNaN(parsed.getTime())) {
      setErrorMessage(errors => ({ ...errors, [durationType]: "Invalid Time Format" }));
      return;
    } else {
      setFormData(data => ({ ...data, [durationType]: format(parsed, "HH:mm") }));
    }
  };

  const handleCalcClick = () => {
    if (formData.startTime && formData.endTime) {
      const { data, status } = timeGapCalculator(formData.startTime, formData.endTime);
      if (status === "error") return setErrorMessage(errors => ({ ...errors, duration: data }));

      setDuration(data);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    setIsLoading(true);
    e.preventDefault();

    try {
      const { date, endTime, notes, selectedTask, startTime, selectedCategory } = formData;
      const { data, message, status } = await editUserTaskAction({
        id: dataToUpdate.userTaskId,
        startTime,
        endTime,
        date,
        notes,
        taskId: selectedTask.id,
      });

      if (status === "error" && message === "unauthenticated") {
        router.push("/");
        return;
      }

      if (status === "error") {
        // setErrorMessage(errors => ({ ...errors, general: message }));
        setSnackBarState({ open: true, text: message, status: "error" });

        return;
      }

      if (data) {
        const { date, endTime, notes, startTime, taskId, userId, id } = data;
        setFormData(formDataInitialValue);
        const updatedUserTasks = userTasks.map(userTask => {
          if (userTask.userTaskId === id) {
            return {
              taskId,
              userId,
              date,
              endTime,
              startTime,
              notes,
              categoryId: formData.selectedCategory,
              categoryName: categoriesData.filter(category => formData.selectedCategory === category.id)[0].name,
              isByHour: selectedTask.isByHour,
              taskName: selectedTask.name,
              userTaskId: id,
            };
          }
          return userTask;
        });
        setUserTasks(updatedUserTasks);

        //   setUserTasks(tasks => {
        //     const newData = [
        //       ...tasks,
        //       {
        //         taskId,
        //         userId,
        //         date,
        //         endTime,
        //         startTime,
        //         notes,
        //         categoryId: formData.selectedCategory,
        //         categoryName: categoriesData.filter(category => formData.selectedCategory === category.id)[0].name,
        //         isByHour: selectedTask.isByHour,
        //         taskName: selectedTask.name,
        //         userTaskId: id,
        //       },
        //     ];

        //     return newData.sort((a, b) => {
        //       const dateComparison = compareAsc(parseISO(a.date), parseISO(b.date));
        //       if (dateComparison !== 0) return dateComparison;

        //       // Parse and compare startTime
        //       const timeA = parse(a.startTime, "HH:mm", new Date());
        //       const timeB = parse(b.startTime, "HH:mm", new Date());
        //       return compareAsc(timeA, timeB);
        //     });
        //   });

        setSnackBarState({ open: true, text: message, status: "success" });

        setOpen(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSnackBarState({ open: true, text: error.message, status: "error" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const { data, message, status } = await getCategoriesData();

      if (status === "error") {
        setErrorMessage(errorObj => ({ ...errorObj, categoryError: message }));
      }

      if (data) {
        setCategoriesData(data);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (formData.selectedCategory) {
        const { data, message, status } = await getTasksOfOneCategory(formData.selectedCategory);
        if (status === "error") {
          setErrorMessage(errorObj => ({ ...errorObj, taskError: message }));
          return;
        }

        if (data) {
          setCategoryTasks(data);
        }
      }
    })();
  }, [formData.selectedCategory]);

  useEffect(() => {
    const {
      categoryId,
      categoryName,
      date,
      endTime,
      isByHour,
      notes,
      startTime,
      taskId,
      taskName,
      userId,
      userTaskId,
    } = dataToUpdate;

    setFormData(() => {
      return {
        selectedCategory: categoryId,
        selectedTask: {
          categoryId: categoryId,
          isByHour: isByHour,
          name: taskName,
          id: taskId,
        },
        date: new Date(date),
        startTime: startTime,
        endTime: endTime,
        notes: notes,
      };
    });
  }, [dataToUpdate]);

  useEffect(() => {
    handleCalcClick();
  }, [formData.endTime, formData.startTime]);

  return (
    <div>
      <Modal
        open={open}
        onClose={() => {
          setFormData(formDataInitialValue);
          setOpen(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" textAlign={"center"} marginBottom={"1rem"} variant="h6" component="h2">
            Add Task
          </Typography>
          <form onSubmit={onSubmit}>
            <Box display={"flex"} flexDirection={"column"} gap={"2rem"}>
              {/* ------------------------ categories --------------------- */}
              <Box>
                <FormControl fullWidth>
                  <InputLabel id="category">Category</InputLabel>
                  <Select
                    labelId="category"
                    id="category"
                    value={formData.selectedCategory}
                    label="Category"
                    defaultValue=""
                    onChange={handleSelectCategory}
                  >
                    {categoriesData?.map(({ id, name }) => {
                      return (
                        <MenuItem key={id} value={id}>
                          {name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                {errorMessage.category && (
                  <Typography variant="body2" color={"crimson"}>
                    {errorMessage.category}
                  </Typography>
                )}
              </Box>

              {/* ---------------------------tasks----------------------- */}
              <Box>
                <FormControl fullWidth>
                  <InputLabel id="task">Tasks</InputLabel>
                  <Select
                    labelId="task"
                    id="task"
                    value={JSON.stringify(formData.selectedTask)}
                    label="Tasks"
                    defaultValue=""
                    onChange={handleSelectTask}
                  >
                    {categoryTasks?.map(task => {
                      return (
                        <MenuItem key={task.id} value={JSON.stringify(task)}>
                          {task.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                {errorMessage.task && (
                  <Typography variant="body2" color={"crimson"}>
                    {errorMessage.task}
                  </Typography>
                )}
              </Box>

              {formData.selectedTask.isByHour && (
                <Box display={"flex"} gap={"1rem"} alignItems={"center"}>
                  <TextField
                    label="start (hh:mm)"
                    defaultValue={formData.startTime}
                    onChange={e => handleDuration(e.target.value, "start")}
                    // error={error}
                    // helperText={error ? "Invalid duration format. Use hh:mm." : ""}
                    placeholder="hh:mm"
                  />
                  <TextField
                    label="end (hh:mm)"
                    defaultValue={formData.endTime}
                    onChange={e => handleDuration(e.target.value, "end")}
                    // error={error}
                    // helperText={error ? "Invalid duration format. Use hh:mm." : ""}
                    placeholder="hh:mm"
                  />

                  {/* ------------------------------ */}
                  <Button onClick={handleCalcClick} variant="contained">
                    C
                  </Button>
                  {/* --------------------------------- */}

                  <Typography>{duration ? duration : "??:??"}</Typography>
                </Box>
              )}
              <Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="select date"
                    value={formData.date}
                    onChange={newValue => {
                      if (newValue) {
                        setFormData(data => ({ ...data, date: newValue }));
                      }
                    }}
                    sx={{ width: "100%" }}
                  />
                </LocalizationProvider>
              </Box>
              <Box>
                <TextField
                  label="note"
                  variant="outlined"
                  value={formData.notes}
                  onChange={e => setFormData(data => ({ ...data, notes: e.target.value }))}
                  rows={3}
                  multiline
                  fullWidth
                />
              </Box>
              <Button variant="contained" type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </Box>
          </form>
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
