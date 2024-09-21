const mongoose = require('mongoose');

const weddingSchema = new mongoose.Schema({
   designName: {type: String, required: true},
   price: {type: Number, required: true},
   image: {type: String, required: true},
   groomName: {type: String, required: true},
   brideName: {type: String, required: true},
   date: {type: Date, required: true},
   time: {type: String, required: true},
   isPaid: {type: Boolean, default: false},
   userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
},{
   timestamps: true
});

const Wedding = mongoose.model("Wedding", weddingSchema);
module.exports = Wedding;