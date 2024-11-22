const mongoose = require('mongoose');
const jwt=require("jsonwebtoken")
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
}, { timestamps: true }); // Optional: Adds createdAt and updatedAt fields
UserSchema.methods.gererateToken= async function()
{
    try
    {
        return jwt.sign(
          {
            email:this.email
          },
          process.env.JWT_KEY,
          {
            expiresIn:"10d",
          }
        );
    }catch(error){
        console.log(error);
    }
};

module.exports = mongoose.model('User', UserSchema);
