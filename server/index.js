const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const connectDB = require('./utils/connectDB');
const usersRouter = require('./router/user/usersRouter');

// connecting to mongodb
connectDB();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// route handlers

app.use('/api', usersRouter);

app.listen(PORT, console.log(`Server running on port ${PORT}`));