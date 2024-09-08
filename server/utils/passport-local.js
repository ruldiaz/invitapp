// passport-local.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');

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
   async (req, username, password, done)=>{
      console.log(`2. Local Strategy verify cb: ${JSON.stringify(username)}`);
      // this is where we call db to verify user
      let user = await User.findOne({email: username});
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

module.exports = passport;
