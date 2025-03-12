import { Box, Typography } from "@mui/material";
import { redirect } from "next/navigation";
import React from "react";

import AdminPanelContainer from "@/components/Admin/AdminPanel";
import { auth } from "@/utils/authOptions";

export default async function page() {
  const session = await auth();
  const user = session.getUser();
  if (!user || user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <>
      <Box sx={{ marginTop: "5rem" }}>
        <Typography textAlign={"center"} variant="h4" component={"h1"}>
          Welcome to Admin Panel
        </Typography>
        <AdminPanelContainer />
      </Box>
    </>
  );
}
