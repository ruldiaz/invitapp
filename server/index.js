const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const connectDB = require('./utils/connectDB');

// connecting to mongodb
connectDB();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.listen(PORT, console.log(`Server running on port ${PORT}`));