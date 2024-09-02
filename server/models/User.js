const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   firstName: {type: String, required: true},
   lastName: {type: String, required: true},
   password: {type: String, required: true},
   email: {type: String, required: true},
   banned: {type: Boolean, required: false}
},{
   timestamps: true,
});

const User = mongoose.model("User", userSchema);
module.exports = User;