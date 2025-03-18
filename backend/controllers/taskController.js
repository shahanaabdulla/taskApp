const { Task } = require('../models');

exports.createTask = async (req, res) => {
    const { title, description, status } = req.body;
    if (!title || !description || !status) {
      return res.status(400).json({ error: 'Title, description, and status are required' });
    }
  
    const userId = req.user.id;  // Assuming the user ID is stored in req.user after authentication
  
    try {
      const task = await Task.create({
        title,
        description,
        status,
        userId,  // Include the authenticated user's ID
      });
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  exports.getAllTasks = async (req, res) => {
    const userId = req.user.id;  // Assuming the user ID is stored in req.user after authentication
  
    try {
      const tasks = await Task.findAll({
        where: { userId },  // Only fetch tasks that belong to the authenticated user
      });
      res.json(tasks);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

  exports.getTaskById = async (req, res) => {
    const userId = req.user.id;  // Assuming the user ID is stored in req.user after authentication
  
    try {
      const task = await Task.findOne({
        where: { id: req.params.id, userId },  // Ensure the task belongs to the authenticated user
      });
  
      if (!task) return res.status(404).json({ message: 'Task not found' });
  
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  exports.updateTask = async (req, res) => {
    const { title, description, status } = req.body;
    if (!title || !description || !status) {
      return res.status(400).json({ error: 'Title, description, and status are required' });
    }
  
    const userId = req.user.id;  // Assuming the user ID is stored in req.user after authentication
  
    try {
      const task = await Task.findOne({
        where: { id: req.params.id, userId },  // Ensure the task belongs to the authenticated user
      });
  
      if (!task) return res.status(404).json({ message: 'Task not found' });
  
      await task.update({ title, description, status });
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  

  exports.deleteTask = async (req, res) => {
    const userId = req.user.id;  // Assuming the user ID is stored in req.user after authentication
  
    try {
      const task = await Task.findOne({
        where: { id: req.params.id, userId },  // Ensure the task belongs to the authenticated user
      });
  
      if (!task) return res.status(404).json({ message: 'Task not found' });
  
      await task.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  