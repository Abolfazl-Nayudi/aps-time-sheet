import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { Box, List, ListItem, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

const securityItems = [{ title: "Change Password", path: "/dashboard/change-password" }];
export default function SecuritySection() {
  return (
    <Box height={300} width={"80%"} margin={"10rem auto 0 "} padding={2} borderRadius={3} boxShadow={2}>
      <Typography variant="h5" component={"h3"}>
        Security
      </Typography>

      <List sx={{ marginTop: "1rem" }}>
        {securityItems.map((item, index) => {
          return (
            <ListItem key={index} sx={{}}>
              <Box
                width={"100%"}
                padding={"10px"}
                borderBottom={"1px solid lightgray"}
                borderRadius={"2px"}
                display={"flex"}
                justifyContent={"space-between"}
                color={"inherit"}
                sx={{
                  textDecoration: "none",
                  transition: "all 0.1s ease",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#e74924",
                    color: "#ffffff",
                  },
                  "& svg": {
                    transition: "all 0.1s ease",
                  },
                  "&:hover svg": {
                    transform: "translateX(5px)",
                  },
                }}
                component={Link}
                href={item.path}
              >
                <Typography>{item.title}</Typography>
                <ArrowForwardIosRoundedIcon />
              </Box>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
