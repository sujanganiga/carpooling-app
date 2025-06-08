const Review = require("../models/Review");
const Ride = require("../models/Ride");
const User = require("../models/User");
const { sendReviewNotification } = require("../utils/email");

exports.submitReview = async (req, res) => {
  try {
    const { rideId, rating, comment } = req.body;
    const userId = req.user.id;

    // Get ride details using Sequelize
    const ride = await Ride.findByPk(rideId, {
      include: [
        {
          model: User,
          as: "driver",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      where: {
        rideId: rideId,
        reviewerId: userId,
      },
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You already reviewed this ride" });
    }

    // Create review
    const review = await Review.create({
      rideId: rideId,
      reviewerId: userId,
      revieweeId: ride.createdBy,
      role: "driver",
      rating,
      comment,
    });

    // Update user ratings
    await updateUserRating(ride.createdBy);

    // Send email notification
    const reviewee = await User.findByPk(ride.createdBy);
    const reviewer = await User.findByPk(userId);

    await sendReviewNotification(reviewee, reviewer, ride, rating, comment);

    res.status(201).json(review);
  } catch (error) {
    console.error("Error submitting review:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

async function updateUserRating(userId) {
  const reviews = await Review.findAll({
    where: { revieweeId: userId },
  });

  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await User.update({ rating: averageRating }, { where: { id: userId } });
  }
}

exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("Fetching reviews for user:", userId);

    if (!userId) {
      console.error("No user ID provided");
      return res.status(400).json({ message: "User ID is required" });
    }

    const reviews = await Review.findAll({
      where: { revieweeId: userId },
      include: [
        {
          model: User,
          as: "reviewer",
          attributes: ["id", "name", "profilePhoto"],
        },
        {
          model: Ride,
          as: "ride",
          attributes: [
            "id",
            "pickupLocation",
            "dropoffLocation",
            "departureTime",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    console.log(`Found ${reviews.length} reviews for user ${userId}`);

    // Transform the data to ensure all required fields are present
    const transformedReviews = reviews.map((review) => ({
      ...review.toJSON(),
      reviewer: review.reviewer || {
        name: "Anonymous",
        profilePhoto: "/default-profile.png",
      },
      ride: review.ride || null,
    }));

    res.json(transformedReviews);
  } catch (error) {
    console.error("Error getting reviews:", error);
    res.status(500).json({
      message: "Error fetching reviews",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
