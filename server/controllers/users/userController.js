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
   },
   get: async (req, res)=>{
      try {
         console.log(req.user.email);
         
         let user = await User.findOne({email: req.user.email})
         if(!user){
            return res.status(404).json({
               timestamp: Date.now(),
               msg: 'User not found.',
               code: 404
            });
         }
         res.status(200).json({
            user: {
               id: user.id,
               email: user.email,
               firstName: user.firstName,
               lastName: user.lastName
            }
         })
      } catch (error) {
         console.error(new Error(error.message));
         res.status(500).json({
            timestamps: Date.now(),
            msg: 'Failed to get user, internal server error.',
            code: 500
         })
      }
   },
   logout: async (req, res) => {
      try {
         // Passport's logout method
         req.logout();
   
         // Destroy session
         req.session.destroy((err) => {
            if (err) {
               return res.status(500).json({
                  timestamp: Date.now(),
                  msg: 'Failed to destroy session.',
                  code: 500
               });
            }
   
            // Clear the cookie (optional)
            res.clearCookie('connect.sid');
   
            return res.status(200).json({
               timestamp: Date.now(),
               message: 'Logout success.',
               code: 200
            });
         });
      } catch (error) {
         console.error('Logout error:', error);
         return res.status(500).json({
            timestamp: Date.now(),
            msg: 'Logout failed.',
            code: 500
         });
      }
   },
   inexistent: async (req, res)=>{
      try {
         res.status(404).json({
            timestamps: Date.now(),
            message: 'Endpoint not found'
         })
      } catch (error) {
         throw new Error(error);
      }
   }
   
}



module.exports = userController;