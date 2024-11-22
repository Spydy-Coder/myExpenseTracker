const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema({
  tripName: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  uniqueId: {
    type: String,
    unique: true,
    required: true,
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',  // Reference to the user who created the trip
    required: true
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Array to store members participating in the trip
});

module.exports = mongoose.model('Trip', tripSchema);
