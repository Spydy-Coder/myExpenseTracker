const mongoose = require("mongoose");

const expenseRequestSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the user
    ref: "User", // Assuming you have a User model
    required: true,
  },
  payee: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the user
    ref: "User", // Assuming you have a User model
    required: true,
  },
  trip_id: {
    type: String, // Reference to the trip
    required: true,
  },
  total_money: {
    type: Number,
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
      paid:{
        type:Boolean,
        default: false
      },
      
    },
  ],
  money_left: {
    type: Number,
    default:0,
    min: 0, // Ensure no negative amounts
  },
  moneyToBeReceive: {
    type: Number,
    default:0,
    min: 0, // Ensure no negative amounts
  },
});

const ExpenseRequest = mongoose.model("ExpenseRequest", expenseRequestSchema);

module.exports = ExpenseRequest;
