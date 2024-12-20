import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { ExportModalFormSchema, ExportModalFormValues } from "@/utils/zod/ExportModalFormSchema";

import SnackBarComponent from "../SnackBar";
import { UserTaskDataType } from ".";
import { appendToSheetAction } from "./actions/appendToSheetAction";
import { getSheetNames } from "./actions/getSheetNamesAction";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

type PropsTypes = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  tasksData: UserTaskDataType[];
};

export default function ExportToSheetModal({ open, setOpen, tasksData }: PropsTypes) {
  const [openSnackBar, setOpenSnackBar] = useState(false);

  const [sheetNames, setSheetNames] = useState<string[] | []>([]);
  const [errorMessage, setErrorMessage] = useState({ sheetNames: "", general: "" });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExportModalFormValues>({
    resolver: zodResolver(ExportModalFormSchema),
    defaultValues: {
      page: "",
      row: "",
    },
  });

  useEffect(() => {
    (async () => {
      const { data, message, status } = await getSheetNames();

      if (status === "error") {
        setErrorMessage(errors => ({ ...errors, sheetNames: message }));
        return;
      }
      if (data) {
        setSheetNames(data);
      }
    })();
  }, []);

  const onSubmit = async ({ page, row }: ExportModalFormValues) => {
    setErrorMessage({ sheetNames: "", general: "" });
    try {
      const { message, status, data } = await appendToSheetAction({ page, row, data: tasksData });
      if (status === "error") {
        setErrorMessage(errors => ({ ...errors, general: message }));
        return;
      }
      if (status === "success") {
        setOpenSnackBar(true);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(errors => ({ ...errors, general: error.message }));
      }
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" textAlign={"center"} marginBottom={3}>
            Export To Sheet
          </Typography>

          <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }} onSubmit={handleSubmit(onSubmit)}>
            <Box>
              <FormControl fullWidth>
                <InputLabel id="sheetName">Sheet Name</InputLabel>
                <Select labelId="sheetName" id="" label="sheet Name" defaultValue={""} {...register("page")}>
                  {sheetNames?.map(name => {
                    return (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              {errors.page && (
                <Typography color={"crimson"} variant="body2">
                  {errors.page.message}
                </Typography>
              )}
              {errorMessage.sheetNames && (
                <Typography color={"crimson"} variant="body2">
                  {errorMessage.sheetNames}
                </Typography>
              )}
            </Box>

            <Box>
              <TextField id="row" label="Row: (e.g., B4, G2) " variant="outlined" {...register("row")} fullWidth />
              {errors.row && (
                <Typography color={"crimson"} variant="body2">
                  {errors.row.message}
                </Typography>
              )}
            </Box>

            <Button variant="contained" type="submit">
              Export To Sheet
            </Button>
          </form>
          {errorMessage.general && (
            <Typography variant="body2" color={"crimson"}>
              {errorMessage.general}
            </Typography>
          )}
        </Box>
      </Modal>
      <SnackBarComponent open={openSnackBar} setOpen={setOpenSnackBar} text={`Tasks inserted Successfully`} />
    </div>
  );
}
