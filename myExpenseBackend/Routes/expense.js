const {saveExpense, getExpensesByTripAndUser} = require("../Controllers/expenseController")
const express = require('express');
const router = express.Router();

router.post("/create", saveExpense);
router.get("/get/:tripId/:userId", getExpensesByTripAndUser);

module.exports = router;