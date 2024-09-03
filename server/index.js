const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const connectDB = require('./utils/connectDB');
const usersRouter = require('./router/user/usersRouter');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const cors = require('cors');
const User = require('./models/User');

// connecting to mongodb
connectDB();

const PORT = process.env.PORT || 3000;

const corsOptions = {
   origin: 'http://localhost:9000',
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

passport.serializeUser((user, done)=>{
   console.log(`4. Serialize user: ${JSON.stringify(user.id)}`);
   return done(null, user.id);
})

passport.deserializeUser(async (id, done)=>{
   console.log(`Deserializing user: ${id}`);
   const user = await User.findById(id);
   if(user){
      console.log('User found during deserialization:', user);
      return done(null, {id: user, email: user.email})
   }else{
      console.error('User not found during deserialization');
      return done(new Error('No user with id is found'));
   }
})

passport.use('local', new LocalStrategy({passReqToCallback: true},
   async (req, username, passport, done)=>{
      console.log(`2. Local Strategy verify cb: ${JSON.stringify(username)}`);
      // this is where we call db to verify user
      let user = await User.findOne(username);
      if(!user){
         console.log('User not found');
         return done(null, false);
      }
      console.log(`User from db: ${JSON.stringify(user)}`);
      // compare incoming passport to store password usin bcrypt

      const result = await new Promise((resolve, reject)=>{
         bcrypt.compare(password, user.password, (err, res)=>{
            if(err) reject(err);
            resolve(res);
         });
      });
      if(result){
         return done(null, user);
      }else{
         return done('Password or username is incorrect. Please try again.', null);
      }
   }
))

// route handlers

app.use('/api', usersRouter);

app.listen(PORT, console.log(`Server running on port ${PORT}`));