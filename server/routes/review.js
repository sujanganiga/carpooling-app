const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const auth = require("../middleware/auth");

// Submit a review
router.post("/", auth, reviewController.submitReview);

// Get reviews for a specific user
router.get("/user/:userId", auth, reviewController.getUserReviews);

module.exports = router;
