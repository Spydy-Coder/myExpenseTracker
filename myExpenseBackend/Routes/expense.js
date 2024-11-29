
const express = require("express");
const router = express.Router();

// Import the controller functions
const {
  saveExpense,
  getExpensesByTripAndUser,
  getExpensesRequestByUser,
  saveMarkExpensesPaid,
  saveExpenseRequest,
  getTotalExpense
} = require("../Controllers/expenseController");

// Route to create a new expense entry
router.post("/create", saveExpense);

// Route to get all expense requests for a specific user
router.get("/requests/:userId", getExpensesRequestByUser);

// Route to get expenses for a specific trip and user
router.get("/:tripId/:userId", getExpensesByTripAndUser);
router.get("/totalexpense/:tripId/:userId", getTotalExpense);

// Route to save an expense request
router.post("/request", saveExpenseRequest);
router.post("/markAllPaid", saveMarkExpensesPaid);

module.exports = router;
