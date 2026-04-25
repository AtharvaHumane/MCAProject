const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customer: String,
  customerName: String,
  owner: String,
  services: [
    {
      name: String,
      price: Number,
    }
  ],
  total: Number,
  date: String,
  time: String,
  status: { type: String, default: "pending" }
});

module.exports = mongoose.model("Booking", bookingSchema);
