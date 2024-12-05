"use client";
import { Box, Button } from "@mui/material";
import React, { useState } from "react";

import AddCategoryModal from "./AddCategoryModal";
import TasksTable from "./TasksTable";

const tasks = [
  {
    id: 1,
    category: "Development",
    task: "Build login page",
    price: 1000,
    isPerHour: false,
    hourPrice: null,
  },
  {
    id: 2,
    category: "Design",
    task: "Create logo design",
    price: 500,
    isPerHour: true,
    hourPrice: 100,
  },
  {
    id: 3,
    category: "Testing",
    task: "Perform unit testing",
    price: 800,
    isPerHour: false,
    hourPrice: null,
  },
  {
    id: 4,
    category: "Maintenance",
    task: "Fix website bugs",
    price: null,
    isPerHour: true,
    hourPrice: 150,
  },
  {
    id: 5,
    category: "Consulting",
    task: "Project planning session",
    price: 2000,
    isPerHour: false,
    hourPrice: null,
  },
];

export default function TaskContainer() {
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);

  return (
    <Box component={"section"}>
      <Box display={"flex"} gap={2} justifyContent={"center"} marginTop={"2rem"}>
        <Button variant="contained" onClick={() => setAddCategoryModalOpen(true)}>
          ADD Category
        </Button>
        <Button variant="contained">ADD Task</Button>
      </Box>
      <TasksTable tasks={tasks} />

      <AddCategoryModal open={addCategoryModalOpen} setOpen={setAddCategoryModalOpen} />
    </Box>
  );
}
