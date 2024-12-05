"use client";
import { Box, Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import { getTaskData } from "@/utils/commenQueries/getTaskData";

import AddCategoryModal from "./AddCategoryModal";
import AddTaskModal from "./AddTaskModal";
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

export type TaskDataType = {
  taskId: string;
  categoryId: string;
  price: string | null;
  isByHour: boolean;
  hourPrice: string | null;
  taskName: string;
  categoryName: string;
};

export default function TaskContainer() {
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [taskData, setTaskData] = useState<TaskDataType[] | []>([]);
  useEffect(() => {
    (async () => {
      const { data, message, status } = await getTaskData();

      if (status === "error") {
        setErrorMessage(message);
        return;
      }
      if (data) {
        setTaskData(data);
      }
    })();
  }, []);

  return (
    <Box component={"section"}>
      <Box display={"flex"} gap={2} justifyContent={"center"} marginTop={"2rem"}>
        <Button variant="contained" onClick={() => setAddCategoryModalOpen(true)}>
          ADD Category
        </Button>
        <Button variant="contained" onClick={() => setAddTaskModalOpen(true)}>
          ADD Task
        </Button>
      </Box>
      <TasksTable tasks={taskData} />
      {errorMessage && (
        <Typography variant="body2" color={"crimson"}>
          {errorMessage}
        </Typography>
      )}
      <AddCategoryModal open={addCategoryModalOpen} setOpen={setAddCategoryModalOpen} />
      <AddTaskModal open={addTaskModalOpen} setOpen={setAddTaskModalOpen} />
    </Box>
  );
}
