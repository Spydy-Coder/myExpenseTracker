const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  tripName: String,
  desc: String,
  date: Date,
  uniqueId: { type: String, unique: true }, 
});

module.exports = mongoose.model('TripSchema', tripSchema);