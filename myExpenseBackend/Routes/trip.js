const express = require('express');
const router = express.Router();
const TripSchema = require('../Models/TripSchema');

// Register a new user
router.post('/create', async (req, res) => {
  try {
    console.log("create",req.body)
    const newTrip = new TripSchema(req.body);
    console.log("new",newTrip)
    await newTrip.save();
    res.status(201).json(newTrip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
