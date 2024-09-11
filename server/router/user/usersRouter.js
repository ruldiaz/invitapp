const express = require('express');
const passport = require('passport');
const userController = require('../../controllers/users/userController');

class UsersRouter {
  constructor() {
    this.router = express.Router();
    this.initializeRoutes();
  }

  // Middleware: Require authentication
  requireAuth(req, res, next) {
    console.log("\n Require auth middleware...");
    console.log(`Session ID: `, req.session);
    console.log('User in session:', req.user);
    if (req.isAuthenticated()) {
      next();
    } else {
      return res.status(403).json({
        timestamp: Date.now(),
        msg: 'Access denied.',
        code: 403,
      });
    }
  }

  // Define routes
  initializeRoutes() {
    this.router.post('/register', userController.register);
    this.router.post('/login', userController.login);

    // Google OAuth Routes
    this.router.get(
      '/auth/google',
      passport.authenticate('google', {
        scope: ['profile', 'email'],
      })
    );

    this.router.get(
      '/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/login' }),
      (req, res) => {
        res.redirect('http://localhost:5173/profile');
      }
    );

    // GitHub OAuth Routes
    this.router.get(
      '/auth/github',
      passport.authenticate('github', { scope: ['user:email'] })
    );

    this.router.get(
      '/auth/github/callback',
      passport.authenticate('github', { failureRedirect: '/login' }),
      (req, res) => {
        res.redirect('http://localhost:5173/profile');
      }
    );

    // Authenticated User Routes
    this.router.get('/user', this.requireAuth.bind(this), userController.get);
    this.router.post('/logout', userController.logout);
    this.router.get('/check-auth', userController.checkAuth);
    this.router.put('/user/update', this.requireAuth.bind(this), userController.updateProfile);
    this.router.put('/user/update-password', this.requireAuth.bind(this), userController.updatePassword);

    // Handle all other routes
    this.router.all('*', userController.inexistent);
  }
}

module.exports = new UsersRouter().router;
