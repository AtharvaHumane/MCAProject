const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:String,
  phone:String,
  email:String,
  password:String,
  role:{type:String, enum:["customer","owner"]},
  savedCart: [
    {
      name: String,
      price: Number,
      category: String,
      subtitle: String,
      image: String
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
