"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, TextField, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";

import { LoginFormSchema, LoginFormValues } from "@/utils/zod/LoginFormSchema";

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log("Login Data: ", data);
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
      <Button type="submit" variant="contained" fullWidth>
        Login
      </Button>
      <Typography variant="body2" textAlign="center">
        Don&apos;t have an account?{" "}
        <Link href="/signup" style={{ textDecoration: "none", color: "#1976d2" }}>
          Sign up
        </Link>
      </Typography>
    </Box>
  );
};

export default LoginForm;
