const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  upiId: { // New field for UPI ID
    type: String,
    default: '', // Can be empty initially
  },
  trips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
}, { timestamps: true });

// Generate JWT token
UserSchema.methods.generateToken = async function() {
  try {
    return jwt.sign(
      { email: this.email },
      process.env.JWT_KEY,
      { expiresIn: "10d" }
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = mongoose.model('User', UserSchema);
