const User = require('../../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');

class UserController {
  // Register new user method
  async register(req, res) {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields',
      });
    }

    const userFound = await User.findOne({ email });
    if (userFound) {
      //throw new Error('User already exists');
      return res.status(400).json({
        status: 'error',
        message: 'User already exists',
        code: 400
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRegistered = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      userRegistered,
    });
  }

  // Login method
  async login(req, res, next) {
    console.log(`1. Login handler: ${JSON.stringify(req.body)}`);

    passport.authenticate('local', (err, user) => {
      console.log(`3. Passport Authenticate cb: ${JSON.stringify(user)}`);

      if (err) {
        return res.status(401).json({
          timestamp: Date.now(),
          msg: 'Access denied: Username or password is incorrect.',
          code: 401,
        });
      }
      if (!user) {
        return res.status(401).json({
          timestamp: Date.now(),
          msg: 'Unauthorized user',
          code: 401,
        });
      }

      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        console.log('User logged in:', req.user);
        return res.status(200).json({
          redirectTo: '/profile',
        });
      });
    })(req, res, next);
  }

  // Get user method
  async get(req, res) {
    try {
      console.log(req.user.email);

      let user = await User.findOne({ email: req.user.email });
      if (!user) {
        return res.status(404).json({
          timestamp: Date.now(),
          msg: 'User not found.',
          code: 404,
        });
      }
      res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      console.error(new Error(error.message));
      res.status(500).json({
        timestamps: Date.now(),
        msg: 'Failed to get user, internal server error.',
        code: 500,
      });
    }
  }

  // Logout method
  async logout(req, res) {
    try {
      // Passport's logout method
      req.logout();

      req.session = null;
      res.clearCookie('app-auth');

      return res.status(200).json({
        timestamp: Date.now(),
        message: 'Logout success.',
        code: 200,
      });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({
        timestamp: Date.now(),
        msg: 'Logout failed.',
        code: 500,
      });
    }
  }

  // Update user profile
  async updateProfile(req, res) {
    const { firstName, lastName } = req.body;
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          msg: 'User not found.',
        });
      }
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;

      await user.save();
      res.status(200).json({
        msg: 'Profile updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Failed to update profile.',
        error: error.message,
      });
    }
  }

  // Update password
  async updatePassword(req, res) {
    const { password } = req.body;
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          msg: 'User not found.',
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();
      res.status(200).json({
        msg: 'Password updated successfully.',
      });
    } catch (error) {
      res.status(500).json({
        msg: 'Failed to update password.',
      });
    }
  }

  // Inexistent routes method
  async inexistent(req, res) {
    try {
      res.status(404).json({
        timestamps: Date.now(),
        message: 'Endpoint not found',
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  // Validate authentication method
  async checkAuth(req, res) {
    if (req.isAuthenticated()) {
      return res.status(200).json({ isAuthenticated: true });
    } else {
      return res.status(200).json({ isAuthenticated: false });
    }
  }
}

module.exports = new UserController();
