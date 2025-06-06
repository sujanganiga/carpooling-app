const { Op } = require("sequelize");
const Ride = require("../models/Ride");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Review = require("../models/Review");
const {
  sendBookingNotificationToDriver,
  sendBookingConfirmationToPassenger,
  sendBookingRejectionToPassenger,
} = require("../utils/email");

// Create a new ride
const createRide = async (req, res) => {
  try {
    // Check if user is a driver
    if (!req.user.isDriver) {
      return res.status(403).json({
        message: "You must be in driver mode to offer rides",
      });
    }

    const {
      pickupLocation,
      dropoffLocation,
      departureTime,
      arrivalTime,
      price,
      seatsAvailable,
      distance,
      pickupLat,
      pickupLng,
      dropoffLat,
      dropoffLng,
    } = req.body;

    if (
      !pickupLocation ||
      !dropoffLocation ||
      !departureTime ||
      !arrivalTime ||
      !price ||
      !seatsAvailable ||
      !distance ||
      !pickupLat ||
      !pickupLng ||
      !dropoffLat ||
      !dropoffLng
    ) {
      return res.status(400).json({ message: "All ride fields are required" });
    }

    if (new Date(departureTime) >= new Date(arrivalTime)) {
      return res
        .status(400)
        .json({ message: "Arrival time must be after departure time" });
    }

    const ride = await Ride.create({
      pickupLocation,
      dropoffLocation,
      departureTime,
      arrivalTime,
      price,
      seatsAvailable,
      distance,
      pickupLat,
      pickupLng,
      dropoffLat,
      dropoffLng,
      createdBy: req.user.id,
    });

    res.status(201).json({ message: "Ride created successfully", ride });
  } catch (error) {
    console.error("Create ride error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get rides with pagination and filters
const getRides = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const offset = (page - 1) * limit;
    const {
      pickup,
      dropoff,
      date,
      maxPrice,
      minSeats,
      sortBy = "departureTime",
      sortOrder = "asc",
    } = req.query;

    let whereClause = {
      seatsAvailable: { [Op.gt]: 0 },
      arrivalTime: { [Op.gt]: new Date() }, // Only show rides with future arrival times
    };

    if (pickup) whereClause.pickupLocation = { [Op.iLike]: `%${pickup}%` };
    if (dropoff) whereClause.dropoffLocation = { [Op.iLike]: `%${dropoff}%` };

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      whereClause.departureTime = { [Op.between]: [startDate, endDate] };
    }

    if (maxPrice) whereClause.price = { [Op.lte]: parseFloat(maxPrice) };
    if (minSeats) whereClause.seatsAvailable = { [Op.gte]: parseInt(minSeats) };

    // Validate sortBy parameter
    const validSortFields = ["departureTime", "price", "distance"];
    const finalSortBy = validSortFields.includes(sortBy)
      ? sortBy
      : "departureTime";
    const finalSortOrder = sortOrder.toLowerCase() === "desc" ? "DESC" : "ASC";

    const { count, rows } = await Ride.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "driver",
          attributes: ["name", "phone", "rating", "profilePhoto", "isDriver"],
        },
      ],
      order: [[finalSortBy, finalSortOrder]],
      limit,
      offset,
    });

    return res.json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      rides: rows,
    });
  } catch (error) {
    console.error("Get rides error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Book a ride
const bookRide = async (req, res) => {
  try {
    // Check if user is in driver mode
    if (req.user.isDriver) {
      return res.status(403).json({
        message: "You must switch to passenger mode to book rides",
      });
    }

    const rideId = req.params.rideId;
    const ride = await Ride.findByPk(rideId);

    if (!ride) return res.status(404).json({ message: "Ride not found" });

    if (new Date(ride.departureTime) < new Date()) {
      return res.status(400).json({ message: "Cannot book past rides" });
    }

    if (ride.seatsAvailable <= 0) {
      return res.status(400).json({ message: "No seats available" });
    }

    const existingBooking = await Booking.findOne({
      where: { rideId, userId: req.user.id },
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ message: "You have already booked this ride" });
    }

    const booking = await Booking.create({
      rideId,
      userId: req.user.id,
      status: "pending",
    });

    // Send email to driver after booking is created
    try {
      const driver = await User.findByPk(ride.createdBy);
      if (driver && driver.email) {
        await sendBookingNotificationToDriver(driver, req.user, ride);
      }
    } catch (emailError) {
      console.error(
        "Error sending booking notification email to driver:",
        emailError
      );
    }

    res.json({ message: "Booking request sent successfully", booking });
  } catch (error) {
    console.error("Book ride error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Confirm a booking
const confirmBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findByPk(bookingId, {
      include: [{ model: Ride, as: "ride" }],
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the current user is the driver of the ride
    if (booking.ride.createdBy !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the driver can confirm bookings" });
    }

    if (booking.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Booking is not in pending state" });
    }

    // Check if there are still seats available
    if (booking.ride.seatsAvailable <= 0) {
      return res.status(400).json({ message: "No seats available" });
    }

    // Update booking status and decrease available seats
    await booking.update({ status: "confirmed" });
    await booking.ride.decrement("seatsAvailable", { by: 1 });

    // Send email to passenger after booking is confirmed
    try {
      const passenger = await User.findByPk(booking.userId);
      const driver = await User.findByPk(booking.ride.createdBy);
      if (passenger && passenger.email && driver) {
        await sendBookingConfirmationToPassenger(
          passenger,
          driver,
          booking.ride
        );
      }
    } catch (emailError) {
      console.error(
        "Error sending booking confirmation email to passenger:",
        emailError
      );
    }

    res.json({ message: "Booking confirmed successfully", booking });
  } catch (error) {
    console.error("Confirm booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark ride booking as completed
/*const completeRide = async (req, res) => {
  try {
    const rideId = req.params.rideId;

    const booking = await Booking.findOne({
      where: { rideId, userId: req.user.id },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "completed") {
      return res
        .status(400)
        .json({ message: "Ride already marked as completed" });
    }

    await Booking.update(
      { status: "completed" },
      { where: { id: booking.id } }
    );

    res.json({ message: "Ride completed successfully" });
  } catch (error) {
    console.error("Complete ride error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
*/
// Add to completeRide function
const completeRide = async (req, res) => {
  try {
    const rideId = req.params.rideId;

    const ride = await Ride.findByPk(rideId, {
      include: [
        {
          model: Booking,
          as: "bookings",
          include: [{ model: User, as: "user" }],
        },
      ],
    });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Check if user is the driver
    const isDriver = ride.createdBy === req.user.id;

    // Check if user is a passenger with a booking
    const isPassenger = ride.bookings.some(
      (booking) =>
        booking.userId === req.user.id && booking.status === "confirmed"
    );

    if (!isDriver && !isPassenger) {
      return res.status(403).json({
        message:
          "You must be either the driver or a confirmed passenger to complete this ride",
      });
    }

    if (isDriver) {
      // If driver, complete all bookings for this ride
      await Booking.update(
        { status: "completed" },
        { where: { rideId: ride.id } }
      );
      await ride.update({ status: "completed" });
    } else {
      // If passenger, only complete their own booking
      await Booking.update(
        { status: "completed" },
        {
          where: {
            rideId: ride.id,
            userId: req.user.id,
          },
        }
      );
    }

    res.json({
      message: "Ride marked as completed",
      ride,
      completedBy: isDriver ? "driver" : "passenger",
    });
  } catch (error) {
    console.error("Error completing ride:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get rides created and booked by the user
const getMyRides = async (req, res) => {
  try {
    const userId = req.user.id;

    const driverRides = await Ride.findAll({
      where: { createdBy: userId },
      include: [
        {
          model: Booking,
          as: "bookings",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["name", "phone", "profilePhoto"],
            },
          ],
        },
      ],
    });

    const passengerBookings = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: Ride,
          as: "ride",
          include: [
            {
              model: User,
              as: "driver",
              attributes: ["name", "phone", "profilePhoto"],
            },
          ],
        },
      ],
    });

    // Add reviewed property to each booking
    const passengerBookingsWithReview = await Promise.all(
      passengerBookings.map(async (booking) => {
        const review = await Review.findOne({
          where: {
            rideId: booking.rideId,
            reviewerId: userId,
          },
        });
        return {
          ...booking.toJSON(),
          reviewed: !!review,
        };
      })
    );

    res.json({
      asDriver: driverRides,
      asPassenger: passengerBookingsWithReview,
    });
  } catch (error) {
    console.error("Get my rides error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a ride
const deleteRide = async (req, res) => {
  try {
    const rideId = req.params.rideId;
    const ride = await Ride.findByPk(rideId, {
      include: [{ model: Booking, as: "bookings" }],
    });

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    // Check if the current user is the driver of the ride
    if (ride.createdBy !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the driver can delete this ride" });
    }

    // Check if there are any bookings
    if (ride.bookings && ride.bookings.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete ride with existing bookings" });
    }

    await ride.destroy();
    res.json({ message: "Ride deleted successfully" });
  } catch (error) {
    console.error("Delete ride error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject a booking
const rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findByPk(bookingId, {
      include: [
        {
          model: Ride,
          as: "ride",
          include: [
            {
              model: User,
              as: "driver",
              attributes: ["id", "name", "phone", "rating", "profilePhoto"],
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "phone", "profilePhoto"],
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if the current user is the driver of the ride
    if (booking.ride.createdBy !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the driver can reject bookings" });
    }

    if (booking.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Can only reject pending bookings" });
    }

    await booking.update({ status: "rejected" });

    // Send email to passenger after booking is rejected
    try {
      const passenger = await User.findByPk(booking.userId);
      const driver = await User.findByPk(booking.ride.createdBy);
      if (passenger && passenger.email && driver) {
        await sendBookingRejectionToPassenger(passenger, driver, booking.ride);
      }
    } catch (emailError) {
      console.error(
        "Error sending booking rejection email to passenger:",
        emailError
      );
    }

    res.json({
      message: "Booking rejected successfully",
      booking: {
        ...booking.toJSON(),
        ride: booking.ride,
        user: booking.user,
      },
    });
  } catch (error) {
    console.error("Reject booking error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createRide,
  getRides,
  bookRide,
  completeRide,
  getMyRides,
  confirmBooking,
  deleteRide,
  rejectBooking,
};
