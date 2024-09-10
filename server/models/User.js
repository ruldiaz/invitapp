const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   firstName: {type: String, required: true},
   lastName: {type: String, required: function(){
      // `lastName` is required unless it's an OAuth user (Google or GitHub)
      return !this.googleId && !this.githubId;
   }},
   password: {type: String, required: function(){
      // password is only required for non-oauth users
      return !this.googleId && !this.githubId;
   }},
   email: {type: String, required: false},
   googleId: {type: String, required: false}, // googleId to differentiate Oauth users
   githubId: {type: String, required: false},
   banned: {type: Boolean, required: false}
},{
   timestamps: true,
});

const User = mongoose.model("User", userSchema);
module.exports = User;