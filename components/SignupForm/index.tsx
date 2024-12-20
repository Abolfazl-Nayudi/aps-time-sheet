"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { insertUserData } from "@/utils/commenQueries/insertUserData";
import { SignupFormSchema, SignupFormValues } from "@/utils/zod/SignupFormSchema";

const SignupForm: React.FC<{ type: "ADMIN" | "USER" }> = ({ type }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(SignupFormSchema),
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const onSubmit = async (data: SignupFormValues) => {
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await insertUserData(data);
      if (response.status === 201) {
        setSuccessMessage(response.message);
        if (type === "USER") {
          setTimeout(() => {
            reset();
            router.push("/login");
          }, 1000);
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === "409") {
          setErrorMessage("user already exists");
          return;
        }
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
        Signup
      </Typography>
      <TextField
        label="First Name"
        {...register("firstName")}
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
      />
      <TextField
        label="Last Name"
        {...register("lastName")}
        error={!!errors.lastName}
        helperText={errors.lastName?.message}
      />
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
      <TextField
        label="Confirm Password"
        type="password"
        {...register("confirmPassword")}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
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
      {type === "USER" && (
        <Typography variant="body2" textAlign="center">
          Already have an account?{" "}
          <Link href="/login" style={{ textDecoration: "none", color: "#1976d2" }}>
            Log in
          </Link>
        </Typography>
      )}
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

export default SignupForm;
