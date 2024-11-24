const Trip = require("../Models/TripSchema");
const User = require("../Models/User");
const mongoose = require("mongoose"); // Ensure you import mongoose
const { nanoid } = require("nanoid");

// Create a new trip
exports.createTrip = async (req, res) => {
  try {
    const { tripName, desc, date, createdBy } = req.body;
    const uniqueId = nanoid(8);

    // Ensure all required fields are provided
    if (!tripName || !desc || !date || !createdBy) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Create a new trip instance
    const newTrip = new Trip({
      tripName,
      desc,
      date,
      uniqueId, // Auto-generate uniqueId
      createdBy,
      members: [createdBy], // Initialize with members if provided
    });

    // Save the trip to the database
    await newTrip.save();

    // Update the user's trip list with the new trip
    // await User.findByIdAndUpdate(createdBy, { $push: { trips: newTrip._id } });

    res
      .status(201)
      .json({
        message: "Trip created successfully",
        trip: newTrip,
        uniqueId: uniqueId,
      });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Fetch trips created by or including a particular user
exports.getUserTrips = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find trips where the user is the creator or a member
    const userTrips = await Trip.find({
      $or: [{ createdBy: userId }, { members: userId }],
    });

    res.status(200).json(userTrips);
  } catch (err) {
    res.status(400).json({ error: "Error fetching trips." });
  }
};

// Controller to join a trip
exports.joinTrip = async (req, res) => {
  const { tripCode, userId } = req.body;

  try {
    // Find the trip by its unique code
    const trip = await Trip.findOne({ uniqueId: tripCode });
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Check if the user is already a member
    if (trip.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User already a member of this trip" });
    }

    // Add the user to the trip's members array
    trip.members.push(userId);
    await trip.save();

    res.status(200).json({ message: "Successfully joined the trip", trip });
  } catch (error) {
    res.status(500).json({ message: "Error joining trip", error });
  }
};
