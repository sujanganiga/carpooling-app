const express = require("express");
const {
  createRide,
  getRides,
  bookRide,
  completeRide,
  getMyRides,
  confirmBooking,
  deleteRide,
  rejectBooking,
} = require("../controllers/rideController");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, createRide);
router.get("/", getRides);
router.get("/my-rides", auth, getMyRides);
router.post("/:rideId/book", auth, bookRide);
router.post("/:rideId/complete", auth, completeRide);
router.post("/bookings/:bookingId/confirm", auth, confirmBooking);
router.post("/bookings/:bookingId/reject", auth, rejectBooking);
router.delete("/:rideId", auth, deleteRide);

module.exports = router;
