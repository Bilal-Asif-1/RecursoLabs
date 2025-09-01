import React, { useState } from "react";
import {Container,Card,CardContent,Typography,TextField,Button,List,Box,} from "@mui/material";
import TaskItem from "./TaskItem";

type Task ={
  id: number;
  text: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim() !== "") {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask("");
    }
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const updateTask = (id: number, newText: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, text: newText } : t)));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card sx={{ boxShadow: 5, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Task List
          </Typography>

          {/* Add Task Section */}
          <Box display="flex" gap={2} mb={3}>
            <TextField
              fullWidth
              label="Enter new task"
              variant="outlined"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTask()}
            />
            <Button variant="contained" color="primary" onClick={addTask}>
              Add
            </Button>
          </Box>

          {/* Uncompleted Tasks */}
          <Typography variant="h6" gutterBottom>
            Uncompleted Tasks
          </Typography>
          <List>
            {tasks
              .filter((task) => !task.completed)
              .map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}   
                  onDelete={deleteTask}
                  onUpdate={updateTask}
                />
              ))}
          </List>

          {/* Completed Tasks */}
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            Completed Tasks
          </Typography>
          <List>
            {tasks
              .filter((task) => task.completed)
              .map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}   
                  onDelete={deleteTask}
                  onUpdate={updateTask}
                />
              ))}
          </List>
        </CardContent>
      </Card>
    </Container>
  );
};

export default App;
