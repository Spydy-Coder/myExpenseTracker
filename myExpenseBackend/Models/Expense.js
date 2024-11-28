const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the user
    ref: "User", // Assuming you have a User model
    required: true,
  },
  trip_id: {
    type: String, // Reference to the trip
    required: true,
  },
  expenses: [
    {
      category: {
        type: String,
        required: true, // Example: 'food', 'travel'
        trim: true,
      },
      amount: {
        type: Number,
        required: true,
        min: 0, // Ensure no negative amounts
      },
      desc: {
        type: String,
        trim: true, // Example: 'morning breakfast'
      },
      issued_by: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the user who issued the expense
        ref: "User",
        required: true,
      },
      paid:{
        type:Boolean,
        default:false
      }
    },
  ],
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
