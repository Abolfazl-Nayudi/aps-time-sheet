"use client";
import { createTheme, Theme } from "@mui/material/styles";

import { fontsList } from "./font";

const theme: Theme = createTheme({
  palette: {
    mode: "light",
  },
  typography: {
    fontFamily: fontsList,
  },
});

export default theme;
