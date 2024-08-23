const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String },
  price: { type: Number },
  description: { type: String },
  image: { type: String },
});

module.exports = mongoose.model("Product", productSchema);


