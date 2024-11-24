const express = require('express');
const router = express.Router();
const { createTrip, getUserTrips,joinTrip } = require('../Controllers/tripController');

// Route to create a new trip
router.post('/create', createTrip);

// Route to fetch trips for a specific user
router.get('/user/:userId', getUserTrips);

router.post('/join', joinTrip);

module.exports = router;
