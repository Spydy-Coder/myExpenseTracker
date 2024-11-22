const express = require('express');
const router = express.Router();
const { createTrip, getUserTrips } = require('../Controllers/tripController');

// Route to create a new trip
router.post('/create', createTrip);

// Route to fetch trips for a specific user
router.get('/user/:userId', getUserTrips);

module.exports = router;
