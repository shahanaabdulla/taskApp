// index.js
const express = require('express');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth'); 

const app = express();
app.use(express.json());
app.use(cors());

app.use('/tasks', taskRoutes);
app.use('/auth', authRoutes); 

app.listen(5000, () => console.log('Server running on port 5000'));
