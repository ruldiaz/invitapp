const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   firstName: {type: String, required: true},
   lastName: {type: String, required: true},
   password: {type: String, required: function(){
      // password is only required for non-oauth users
      return !this.googleId;
   }},
   email: {type: String, required: true},
   googleId: {type: String, required: false}, // googleId to differentiate Oauth users
   banned: {type: Boolean, required: false}
},{
   timestamps: true,
});

const User = mongoose.model("User", userSchema);
module.exports = User;