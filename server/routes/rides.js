const express = require("express");
const {
  createRide,
  getRides,
  bookRide,
  completeRide,
  getMyRides,
} = require("../controllers/rideController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, createRide);
router.get("/", getRides);
router.post("/:rideId/book", auth, bookRide); // Changed to :rideId
router.post("/:rideId/complete", auth, completeRide); // Changed to :rideId
router.get("/my-rides", auth, getMyRides);

module.exports = router;
