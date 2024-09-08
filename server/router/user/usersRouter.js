const express = require('express');
const userController = require('../../controllers/users/userController');

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

usersRouter.get('/user', requireAuth, userController.get);
usersRouter.post('/logout', userController.logout);
usersRouter.get('/check-auth', userController.checkAuth);
usersRouter.put('/user/update',requireAuth ,userController.updateProfile);
usersRouter.put('/user/update-password',requireAuth ,userController.updatePassword);
usersRouter.all('*', userController.inexistent);

module.exports = usersRouter;