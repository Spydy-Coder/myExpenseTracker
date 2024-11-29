const express = require('express');
const router = express.Router();
const { registerUser, loginUser, fetchUpiId, updateUpiId } = require('../Controllers/authController');

// Route to register a user
router.post('/register', registerUser);

// Route to login a user
router.post('/login', loginUser);

// Route to fetch UPI ID for a user
router.get('/user/upi/:userId', fetchUpiId);

// Route to update UPI ID for a user
router.post('/user/upi/:userId', updateUpiId);

module.exports = router;
