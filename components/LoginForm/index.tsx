"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

// import { getServerSession } from "@/utils/authGetServerSession";
import { LoginFormSchema, LoginFormValues } from "@/utils/zod/LoginFormSchema";
const LoginForm: React.FC = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,

    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = async ({ email, password }: LoginFormValues) => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const res = await signIn("credentials", { email, password, redirect: false });
      if (res?.error) {
        setErrorMessage(res.error);
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
      <TextField
        label="Password"
        type="password"
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={isSubmitting}
        startIcon={isSubmitting && <CircularProgress size={20} color="inherit" />} // Add spinner
      >
        {isSubmitting ? "Signing up..." : "Signup"}
      </Button>
      <Typography variant="body2" textAlign="center">
        Don&apos;t have an account?{" "}
        <Link href="/signup" style={{ textDecoration: "none", color: "#1976d2" }}>
          Sign up
        </Link>
      </Typography>

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
