const mongoose = require('mongoose');

const connectDB = async ()=>{
   try {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("MongoDB connected succesfully");
      
   } catch (error) {
      console.log(`Error connecting to DB,
         ${error.message}`);
         process.exit();
   }
}

module.exports = connectDB;