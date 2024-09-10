const express = require('express');
const userController = require('../../controllers/users/userController');

const passport = require('passport');
const usersRouter = express.Router();

usersRouter.post('/register', userController.register);
usersRouter.post('/login', userController.login);

const requireAuth = (req, res, next)=>{
   console.log("\n Require auth middleware...");
   console.log(`Session ID: `, req.session);
   console.log('User in session:', req.user);
   if(req.isAuthenticated()){
      next();
   }else{
      return res.status(403).json({
         timestamp: Date.now(),
         msg: 'Access denied.',
         code: 403
      })
   }
}

// Initiating Google authentication
usersRouter.get(
   '/auth/google',
   passport.authenticate('google', {
      scope: ['profile', 'email'],
   })
);

// Google OAuth Callback Route
usersRouter.get(
   '/auth/google/callback',
   passport.authenticate('google', { failureRedirect: '/login' }),
   (req, res) => {
     // Redirect to frontend profile page after successful authentication
     res.redirect('http://localhost:5173/profile');
   }
 );

// GitHub login route
usersRouter.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// GitHub callback route
usersRouter.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication
    res.redirect('http://localhost:5173/profile');
  }
);


usersRouter.get('/user', requireAuth, userController.get);
usersRouter.post('/logout', userController.logout);
usersRouter.get('/check-auth', userController.checkAuth);
usersRouter.put('/user/update',requireAuth ,userController.updateProfile);
usersRouter.put('/user/update-password',requireAuth ,userController.updatePassword);
usersRouter.all('*', userController.inexistent);

module.exports = usersRouter;