import "./globals.css";

import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import type { Metadata } from "next";
import React from "react";

import AuthSessionProvider from "@/context/AuthSessionProvider";
import theme from "@/lib/theme/theme";
import { getServerSession } from "@/utils/authGetServerSession";

export const metadata: Metadata = {
  title: "APSignals",
  description: "IT Consultants and IT Services Company",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = getServerSession();

  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/x-icon" href="./favicon.ico" />
      </head>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <AuthSessionProvider session={session}>{children}</AuthSessionProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
