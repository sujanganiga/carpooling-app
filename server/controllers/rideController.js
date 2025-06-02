const { Op } = require("sequelize");
const Ride = require("../models/Ride");
const Booking = require("../models/Booking");
const User = require("../models/User");

// Create a new ride
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
    } = req.body;

    if (
      !pickupLocation ||
      !dropoffLocation ||
      !departureTime ||
      !arrivalTime ||
      !price ||
      !seatsAvailable
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
    const { pickup, dropoff, date, maxPrice, minSeats } = req.query;

    let whereClause = { seatsAvailable: { [Op.gt]: 0 } };

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

    const { count, rows } = await Ride.findAndCountAll({
      where: whereClause,
      include: [{ model: User, as: "driver", attributes: ["name", "phone"] }],
      order: [["departureTime", "ASC"]],
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
      status: "confirmed",
    });

    await ride.decrement("seatsAvailable", { by: 1 });

    res.json({ message: "Ride booked successfully", booking });
  } catch (error) {
    console.error("Book ride error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark ride booking as completed
const completeRide = async (req, res) => {
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
          include: [{ model: User, as: "user", attributes: ["name", "phone"] }],
        },
      ],
    });

    const riderBookings = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: Ride,
          as: "ride",
          include: [
            { model: User, as: "driver", attributes: ["name", "phone"] },
          ],
        },
      ],
    });

    res.json({ asDriver: driverRides, asRider: riderBookings });
  } catch (error) {
    console.error("Get my rides error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createRide, getRides, bookRide, completeRide, getMyRides };
