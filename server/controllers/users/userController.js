const User = require('../../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');

const userController = {
   register: async (req, res)=>{
      const {firstName, lastName, email, password} = req.body;

      const userFound = await User.findOne({firstName, lastName, email});
      if(userFound){
         throw new Error('User already exists');
      }

      const hashedPasword = await bcrypt.hash(password, 10);

      const userRegistered = await User.create({
         firstName,
         lastName,
         email,
         password: hashedPasword
      });

      return res.status(201).json({
         status: 'success',
         message: 'User registered succesfully',
         userRegistered
      });
   },
   login: async (req, res, next)=>{
      console.log(`1. Login handler: ${JSON.stringify(req.body)}`);
      
      passport.authenticate('local', (err, user)=>{
         console.log(`3. Passport Authenticate cb: ${JSON.stringify(user)}`);
         
         if(err){
            res.status(401).json({
               timestamp: Date.now(),
               msg: `Access denied: Username or password is incorrect.`,
               code: 401
            });
         }
         if(!user){
            res.status(401).json({
               timestamp: Date.now(),
               msg: `Unauthorized user`,
               code: 401
            });
         }

         req.login(user, (err)=>{
            if(err){
               return next(err)
            }
            console.log('User logged in:', req.user);
            res.status(200).json({
               redirectTo: '/profile'
            })
            
         })
      })(req, res, next)
   }
}


module.exports = userController;