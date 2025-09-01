// App.tsx
import React from "react";
import TaskList from "./components/Tasklist";
import "./App.css";
import { Button, TextField, Typography, Container } from "@mui/material";

const App: React.FC = () => {
  return (
    <Container maxWidth="sm" style={{ marginTop: "30px" }}>
  <Typography variant="h4" align="center" gutterBottom>
    Simple Task List
  </Typography>
  <TaskList />
</Container>
  );
};

export default App;
