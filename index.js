const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();


// Initialize app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const corsOptions = {
  origin: 'https://usf54.github.io/todolist-react/',  // Replace with your frontend URL
  methods: 'GET,POST,PUT,DELETE',  // Specify the methods you want to allow
  allowedHeaders: 'Content-Type',  // Add any other headers you want to allow
};
app.use(cors(corsOptions));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/todo-app')
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

// Define a schema for tasks
const taskSchema = new mongoose.Schema({
  user: String, // Unique identifier for the user
  task: String, // The task description
  createdAt: { type: Date, default: Date.now },
});

// Create a model
const Task = mongoose.model('Task', taskSchema);

// API Routes

// Add a task
app.post('/tasks', async (req, res) => {
  const { user, task } = req.body;
  if (!user || !task) {
    return res.status(400).json({ error: 'User and task are required' });
  }
  const newTask = new Task({ user, task });
  await newTask.save();
  res.status(201).json(newTask);
});

// Get all tasks
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Delete a task by ID
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" });
  }
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
