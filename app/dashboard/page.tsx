import { Box, Typography } from "@mui/material";
import React from "react";

import DashboardContainer from "@/components/Dashboard";

export default function DashbaordPage() {
  return (
    <>
      <Box
        marginTop={"2rem"}
        //  sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
      >
        <Typography textAlign={"center"} variant="h4" component={"h1"}>
          Welcome to Dashboard
        </Typography>
        <Typography textAlign={"center"} variant="h6">
          Use Navbar to navigate between pages
        </Typography>
      </Box>
      <DashboardContainer />
    </>
  );
}
