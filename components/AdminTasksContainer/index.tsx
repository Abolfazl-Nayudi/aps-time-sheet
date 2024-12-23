"use client";
import { Box, Button, Stack, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import { getTaskData } from "@/utils/commenQueries/getTaskData";

import { getCategoryData } from "./actions/getCategoryData";
import AddCategoryModal from "./AddCategoryModal";
import AddTaskModal from "./AddTaskModal";
import CategoryTable from "./categoriesTable";
import TasksTable from "./TasksTable";

export type TaskDataType = {
  taskId: string;
  categoryId: string;
  price: string | null;
  isByHour: boolean;
  hourPrice: string | null;
  taskName: string;
  categoryName: string;
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function AdminTaskContainer() {
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ taskError: "", categoryError: "" });
  const [taskData, setTaskData] = useState<TaskDataType[] | []>([]);
  const [value, setValue] = useState(0);
  const [categoryData, setCategoryData] = useState<{ name: string; id: string }[] | []>([]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    (async () => {
      const { data, message, status } = await getTaskData();

      if (status === "error") {
        setErrorMessage(errors => ({ ...errors, taskError: message }));
        return;
      }
      if (data) {
        setTaskData(data);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { data, message, status } = await getCategoryData();
      if (status === "error") {
        setErrorMessage(errors => ({ ...errors, categoryError: message }));
        return;
      }

      if (data) {
        setCategoryData(data);
      }
    })();
  }, []);

  return (
    <Box component={"section"}>
      <Box
        sx={{ borderBottom: 1, borderColor: "divider" }}
        marginTop={"2rem"}
        display={"flex"}
        justifyContent={"center"}
      >
        <Tabs value={value} onChange={handleChange} aria-label="task and category tabs">
          <Tab label="Tasks" {...a11yProps(0)} />
          <Tab label="Categories" {...a11yProps(1)} />
        </Tabs>
      </Box>

      <CustomTabPanel value={value} index={0}>
        <Stack direction={"row"} justifyContent={"center"}>
          <Button variant="contained" onClick={() => setAddTaskModalOpen(true)}>
            ADD Task
          </Button>
        </Stack>
        <TasksTable tasks={taskData} setTasks={setTaskData} categoryData={categoryData} />
        {errorMessage.taskError && (
          <Typography variant="body2" color={"crimson"}>
            {errorMessage.taskError}
          </Typography>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Stack direction={"row"} justifyContent={"center"}>
          <Button variant="contained" onClick={() => setAddCategoryModalOpen(true)}>
            ADD Category
          </Button>
        </Stack>
        <CategoryTable categoryData={categoryData} />
        {errorMessage.categoryError && (
          <Typography variant="body2" color={"crimson"}>
            {errorMessage.categoryError}
          </Typography>
        )}
      </CustomTabPanel>

      <AddCategoryModal
        open={addCategoryModalOpen}
        setOpen={setAddCategoryModalOpen}
        setCategoryData={setCategoryData}
      />
      <AddTaskModal
        open={addTaskModalOpen}
        setOpen={setAddTaskModalOpen}
        setTasks={setTaskData}
        categoryData={categoryData}
      />
    </Box>
  );
}
