const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Local Strategy
passport.use(
  'local',
  new LocalStrategy({ passReqToCallback: true }, async (req, username, password, done) => {
    console.log(`2. Local Strategy verify cb: ${JSON.stringify(username)}`);
    let user = await User.findOne({ email: username });
    if (!user) {
      console.log('User not found');
      return done(null, false);
    }
    console.log(`User from db: ${JSON.stringify(user)}`);

    const result = await new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (err) reject(err);
        resolve(res);
      });
    });

    if (result) {
      return done(null, user);
    } else {
      return done('Password or username is incorrect. Please try again.', null);
    }
  })
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            email: profile.emails && profile.emails[0].value || '',
            firstName: profile.name && profile.name.givenName || '',
            lastName: profile.name && profile.name.familyName || '',
          });
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// Serialization and Deserialization for both strategies
passport.serializeUser((user, done) => {
  console.log(`4. Serialize user: ${JSON.stringify(user.id)}`);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log(`Deserializing user: ${id}`);
  const user = await User.findById(id);
  console.log("Deserialized User: ", user); // Check this output
  if (user) {
    console.log('User found during deserialization:', user);
    return done(null, user);
  } else {
    console.error('User not found during deserialization');
    return done(new Error('No user with this ID found'));
  }
});

module.exports = passport;
