import React, { useState } from "react";
import { IconButton, TextField, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

type Props = {
  task: Task;
  onToggle: (id: number) => void; 
  onDelete: (id: number) => void;
  onUpdate: (id: number, newText: string) => void;
};

const TaskItem: React.FC<Props> = ({ task, onToggle, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [text, setText] = useState(task.text);


  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "8px",
      }}
    >
      {isEditing ? (
        <>
          <TextField
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (onUpdate(task.id, text), setIsEditing(false))}
            size="small"
          />
          <Button
            variant="contained"
            onClick={() => {
              onUpdate(task.id, editText);
              setIsEditing(false);
            }}
          >
            Save
          </Button>
          <Button variant="outlined" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </>
      ) : (
        <>
          <span
            style={{
              textDecoration: task.completed ? "line-through" : "none",
              flex: 1,
            }}
          >
            {task.text}
          </span>

          
          <Button variant="text" onClick={() => onToggle(task.id)}>
            {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
          </Button>

       
          <Button variant="text" onClick={() => setIsEditing(true)}>
            Edit
          </Button>

          <IconButton onClick={() => onDelete(task.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      )}
    </li>
  );
};

export default TaskItem;
