import { Button, CircularProgress, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { roleEnum } from "@/types/roleEnumType";
import { snackBarStateType } from "@/types/snackBarStateType";

import SnackBarComponent from "../SnackBar";
import { changeUserRoleAction } from "./actions/changeUserRoleAction";

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

type PropsTypes = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userData: {
    firstName: string;
    lastName: string;
    email: string;
    role: roleEnum;
    id: string;
  };
};

export default function ChangeUserRoleModal({ open, setOpen, userData }: PropsTypes) {
  const [snackBarState, setSnackBarState] = useState<snackBarStateType>({ open: false, text: "", status: "success" });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChangeRoleClick = async () => {
    setLoading(true);
    try {
      const { data, message, status } = await changeUserRoleAction(userData.id, userData.role);

      if (status === "error" && message === "unauthenticated") {
        router.push("/");
        return;
      }

      if (status === "error") return setSnackBarState({ open: true, text: message, status: "error" });

      if (status === "success" && data) {
        setSnackBarState({ open: true, text: message, status: "success" });
        setOpen(false);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSnackBarState({ open: true, text: error.message, status: "error" });
      }
    } finally {
      setLoading(false);
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
          <Typography id="modal-modal-title" variant="h6" component="h2" textAlign={"center"}>
            Are You Sure
          </Typography>
          <Typography id="modal-modal-description" textAlign={"center"} sx={{ mt: 2 }}>
            to change {userData.firstName} {userData.lastName} from {userData.role} to{" "}
            {userData.role === "ADMIN" ? "USER" : "ADMIN"}
          </Typography>

          <Stack direction={"row"} justifyContent={"center"} gap={"2rem"} marginTop={"1rem"}>
            <Button variant="contained" color="error" disabled={loading} onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={() => handleChangeRoleClick()} disabled={loading}>
              {loading ? <CircularProgress /> : "Change"}
            </Button>
          </Stack>
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
