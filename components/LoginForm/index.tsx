"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

// import { getServerSession } from "@/utils/authGetServerSession";
import { LoginFormSchema, LoginFormValues } from "@/utils/zod/LoginFormSchema";
const LoginForm: React.FC = () => {
  // const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
  });

  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleClickShowPassword = () => setShowPassword(show => !show);

  const onSubmit = async ({ email, password }: LoginFormValues) => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const res = await signIn("credentials", { email, password, redirect: false });

      if (res?.error === "CredentialsSignin") {
        setErrorMessage("The email or password is wrong");
        return;
      }

      if (res?.error) {
        setErrorMessage("There is a problem, please try again later");
      }

      if (res?.ok) {
        setSuccessMessage("logged in successfully");
        setTimeout(() => {
          // router.push("/");
          window.location.replace("/");
        }, 1000);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
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
        Login
      </Typography>
      <TextField
        label="Email"
        type="email"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <FormControl variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="Password"
          label="Password"
          type={showPassword ? "text" : "password"}
          {...register("password")}
          error={!!errors.password}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                // aria-label={showPassword ? "hide the password" : "display the password"}
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText>{errors.password?.message}</FormHelperText>
      </FormControl>

      {/* 
      <TextField
        label="Password"
        id="password"
        type={showPassword ? "text" : "password"}
        // variant="filled"
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
        inputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label={showPassword ? "hide the password" : "display the password"}
                onClick={handleClickShowPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      /> */}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isSubmitting}
        startIcon={isSubmitting && <CircularProgress size={20} color="inherit" />} // Add spinner
      >
        {isSubmitting ? "Logging in..." : "Login"}
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
    </Box>
  );
};

export default LoginForm;
