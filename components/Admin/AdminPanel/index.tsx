import { Box } from "@mui/material";
import React from "react";

import CardNavigator from "./CardNavigator";

const cards = [
  {
    id: "sdf23",
    title: "Tasks",
    description: "Create, Edit, Delete Tasks",
    path: "/admin/tasks",
  },
  {
    id: "23fc",
    title: "Users",
    description: "Check out the Users",
    path: "/admin/users",
  },
];

export default function AdminPanelContainer() {
  return (
    <>
      <Box
        sx={{
          width: "70%",
          margin: "5rem auto 0",
          display: "grid",
          //   gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          justifyContent: "center",
          //   placeItems: "center",
          gap: 2,
        }}
      >
        {cards.map(card => {
          return (
            <React.Fragment key={card.id}>
              <CardNavigator {...card} />
            </React.Fragment>
          );
        })}
      </Box>
    </>
  );
}
