const express = require("express");
const router = express.Router();
const {
  createTrip,
  getTripById,
  updateTrip,
  getUserTrips,
  joinTrip,
  getAllUsernames,
  getAllCategory,
  addNewCategory,
} = require("../Controllers/tripController");

// Route to create a new trip
router.post("/create", createTrip);

// Route to fetch trips for a specific user
router.get("/user/:userId", getUserTrips);
router.get("/allusernames/:tripId", getAllUsernames);
router.get("/allcategory/:tripId", getAllCategory);
router.post("/addnewcategory", addNewCategory);
router.post("/join", joinTrip);
router.get("/details/:tripId", getTripById);
router.put("/update/:tripId", updateTrip);

module.exports = router;
