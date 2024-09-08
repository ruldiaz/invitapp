const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const connectDB = require('./utils/connectDB');
const usersRouter = require('./router/user/usersRouter');
const passport = require('./utils/passport-local');
const bcrypt = require('bcrypt');
const cors = require('cors');
const User = require('./models/User');
//const session = require('express-session');
const cookieSession = require('cookie-session');

// connecting to mongodb
//connectDB();

if (process.env.NODE_ENV !== 'test') {
   connectDB();
 }

 // Load different environment variables depending on NODE_ENV
if (process.env.NODE_ENV === 'test') {
   dotenv.config({ path: '.env.test' });
 } else {
   dotenv.config();
 }

const PORT = process.env.PORT || 3000;

const corsOptions = {
   origin: ['http://localhost:9000','http://localhost:5173'],
   credentials: true,
   methods: ['GET','POST'],
   allowHeaders: ['Content-Type','Authorization']
}

app.use(cors(corsOptions));

app.use(cookieSession({
   name: 'app-auth',
   keys: ['secret-new','secret-old'],
   maxAge: 60 * 60 * 24
}));

app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

// route handlers
app.use('/api', usersRouter);

// Start the server if not in test environment
if (process.env.NODE_ENV !== 'test') {
   app.listen(PORT, () => {
     console.log(`Server running on port ${PORT}`);
   });
 }

 module.exports = app;