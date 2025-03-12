// import React from "react";

// export default function ChangePasswordPage() {
//   return <div>page</div>;
// }

"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import SnackBarComponent from "@/components/SnackBar";
import { snackBarStateType } from "@/types/snackBarStateType";
import { ChangePasswordFormSchema, ChangePasswordFormValues } from "@/utils/zod/ChangePasswordFormSchema";

import { changePasswordAction } from "./actions/changePasswordAction";
const ChangePasswordPage = () => {
  const [snackBarState, setSnackBarState] = useState<snackBarStateType>({ open: false, text: "", status: "success" });

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(ChangePasswordFormSchema),
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const handleClickShowPassword = (inputName: keyof typeof showPasswords) => {
    setShowPasswords({ ...showPasswords, [inputName]: !showPasswords[inputName] });
  };

  const onSubmit = async ({ oldPassword, newPassword }: ChangePasswordFormValues) => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const { data, message, status } = await changePasswordAction({ oldPassword, newPassword });
      if (status === "error" && message === "unauthenticated") {
        router.push("/");
        return;
      }

      if (status === "error") {
        setSnackBarState({ open: true, text: message, status: "error" });
      }

      if (status === "success") {
        setSnackBarState({ open: true, text: message, status: "success" });
        reset();
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message) {
          setSnackBarState({ open: true, text: error.message, status: "success" });
          return;
        }
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 5,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h5" textAlign="center">
        Change Password
      </Typography>

      <TextField
        type={showPasswords.oldPassword ? "text" : "password"}
        variant="outlined"
        label="Old password"
        {...register("oldPassword")}
        error={!!errors.oldPassword}
        helperText={errors.oldPassword?.message}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPasswords.oldPassword ? "hide the password" : "display the password"}
                onClick={() => handleClickShowPassword("oldPassword")}
                edge="end"
              >
                {showPasswords.oldPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        type={showPasswords.newPassword ? "text" : "password"}
        variant="outlined"
        label="New Password"
        {...register("newPassword")}
        error={!!errors.newPassword}
        helperText={errors.newPassword?.message}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPasswords.newPassword ? "hide the password" : "display the password"}
                onClick={() => handleClickShowPassword("newPassword")}
                edge="end"
              >
                {showPasswords.newPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        type={showPasswords.confirmNewPassword ? "text" : "password"}
        variant="outlined"
        label="Confirm new password"
        {...register("confirmNewPassword")}
        error={!!errors.confirmNewPassword}
        helperText={errors.confirmNewPassword?.message}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPasswords.confirmNewPassword ? "hide the password" : "display the password"}
                onClick={() => handleClickShowPassword("confirmNewPassword")}
                edge="end"
              >
                {showPasswords.confirmNewPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isSubmitting}
        startIcon={isSubmitting && <CircularProgress size={20} color="inherit" />} // Add spinner
      >
        {isSubmitting ? "Submiting..." : "Submit"}
      </Button>

      {errorMessage && (
        <Typography variant="body1" textAlign="center" color="crimson">
          {errorMessage}
        </Typography>
      )}
      {successMessage && (
        <Typography variant="body1" textAlign="center" color="green">
          {successMessage}
        </Typography>
      )}

      <SnackBarComponent
        open={snackBarState.open}
        setOpen={setSnackBarState}
        text={snackBarState.text}
        status={snackBarState.status}
      />
    </Box>
  );
};

export default ChangePasswordPage;
