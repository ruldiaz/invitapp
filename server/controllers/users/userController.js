const User = require('../../models/User');
const bcrypt = require('bcrypt');

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
   }
}


module.exports = userController;