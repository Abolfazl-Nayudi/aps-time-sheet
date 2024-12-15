import { Box, Typography } from "@mui/material";
import { redirect } from "next/navigation";
import React from "react";

import { auth } from "@/utils/authOptions";

export default async function page() {
  const session = await auth();
  const user = session.getUser();
  if (!user || user?.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <Box sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
      <Typography textAlign={"center"} variant="h3" component={"h1"}>
        Welcome to Admin Panel
      </Typography>
      <Typography textAlign={"center"} variant="h6">
        Use Navbar to navigate between pages
      </Typography>
    </Box>
  );
}
