const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
   designName: {type: String, required: true},
   price: {type: Number, required: true},
   image: {type: String, required: true},
   groomName: {type: String, required: true},
   brideName: {type: String, required: true},
   date: {type: Date, required: true}
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;