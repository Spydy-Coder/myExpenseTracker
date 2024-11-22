const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../Controllers/authController');

// Register Route
router.post('/register', registerUser);

// Login Route
router.post('/login', loginUser);

module.exports = router;

//we can make clean the routes by defing the logic in the controller
//in router we only have to difine the route