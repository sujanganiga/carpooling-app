import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCar,
  FaUserFriends,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaStar,
  FaUserTie,
  FaUser,
  FaCheckCircle,
  FaHourglassHalf,
  FaClock,
  FaTrash,
  FaTimes,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";
import ReviewModal from "../components/ReviewModal";
import DriftLoading from "../components/DriftLoading";

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  const bgColor = {
    success:
      "bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700",
    error: "bg-red-100 dark:bg-red-900/50 border-red-300 dark:border-red-700",
    warning:
      "bg-yellow-100 dark:bg-yellow-900/50 border-yellow-300 dark:border-yellow-700",
    info: "bg-blue-100 dark:bg-blue-900/50 border-blue-300 dark:border-blue-700",
  };

  const textColor = {
    success: "text-green-700 dark:text-green-300",
    error: "text-red-700 dark:text-red-300",
    warning: "text-yellow-700 dark:text-yellow-300",
    info: "text-blue-700 dark:text-blue-300",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${bgColor[type]} ${textColor[type]} shadow-lg`}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {type === "success" && <FaCheckCircle className="w-5 h-5" />}
          {type === "error" && <FaExclamationTriangle className="w-5 h-5" />}
          {type === "warning" && <FaExclamationTriangle className="w-5 h-5" />}
          {type === "info" && <FaInfoCircle className="w-5 h-5" />}
        </div>
        <p className="flex-1">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-75 transition-opacity"
        >
          <FaTimes className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

const MyRides = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [rides, setRides] = useState({
    asDriver: [],
    asPassenger: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRide, setSelectedRide] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const fetchMyRides = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/api/rides/my-rides");
      setRides(response.data);
    } catch (err) {
      const errorMessage = err.response?.data?.message || t("loadFailed");
      setError(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const completeRide = async (rideId) => {
    try {
      await api.post(`/api/rides/${rideId}/complete`);
      showToast(t("rideCompletedSuccessfully"), "success");
      fetchMyRides();
    } catch (err) {
      showToast(err.response?.data?.message || t("completionFailed"), "error");
    }
  };

  const confirmBooking = async (bookingId) => {
    try {
      await api.post(`/api/rides/bookings/${bookingId}/confirm`);
      showToast(t("bookingConfirmedSuccessfully"), "success");
      fetchMyRides();
    } catch (err) {
      showToast(
        err.response?.data?.message || t("confirmationFailed"),
        "error"
      );
    }
  };

  const rejectBooking = async (bookingId) => {
    try {
      await api.post(`/api/rides/bookings/${bookingId}/reject`);
      showToast(t("bookingRejectedSuccessfully"), "success");
      fetchMyRides();
    } catch (err) {
      showToast(err.response?.data?.message || t("rejectionFailed"), "error");
    }
  };

  const deleteRide = async (rideId) => {
    try {
      await api.delete(`/api/rides/${rideId}`);
      showToast(t("rideDeletedSuccessfully"), "success");
      fetchMyRides();
    } catch (err) {
      showToast(err.response?.data?.message || t("deletionFailed"), "error");
    }
  };

  useEffect(() => {
    fetchMyRides();
  }, []);

  const handleReviewClick = (ride) => {
    setSelectedRide(ride);
    setShowReviewModal(true);
  };

  const handleReviewSubmitted = () => {
    setRides((prevRides) => ({
      ...prevRides,
      asPassenger: prevRides.asPassenger.map((booking) =>
        booking.id === selectedRide.id
          ? { ...booking, reviewed: true }
          : booking
      ),
    }));
    showToast(t("reviewSubmittedSuccessfully"), "success");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
    };
  };

  const renderStatusBadge = (status, reviewed) => {
    const statusConfig = {
      pending: {
        icon: <FaClock className="text-yellow-600" />,
        bg: "bg-yellow-100 dark:bg-yellow-900/50",
        text: "text-yellow-800 dark:text-yellow-300",
        label: t("pending"),
      },
      upcoming: {
        bg: "bg-blue-100 dark:bg-blue-900/50",
        text: "text-blue-800 dark:text-blue-300",
        label: t("upcoming"),
      },
      confirmed: {
        bg: "bg-green-100 dark:bg-green-900/50",
        text: "text-green-800 dark:text-green-300",
        label: t("confirmed"),
      },
      "in-progress": {
        bg: "bg-yellow-100 dark:bg-yellow-900/50",
        text: "text-yellow-800 dark:text-yellow-300",
        label: t("inProgress"),
      },
      completed: {
        bg: "bg-green-100 dark:bg-green-900/50",
        text: "text-green-800 dark:text-green-300",
        label: t("completed"),
      },
      cancelled: {
        bg: "bg-red-100 dark:bg-red-900/50",
        text: "text-red-800 dark:text-red-300",
        label: t("cancelled"),
      },
      rejected: {
        bg: "bg-red-100 dark:bg-red-900/50",
        text: "text-red-800 dark:text-red-300",
        label: t("rejected"),
      },
    };

    const config = statusConfig[status] || {
      bg: "bg-gray-100 dark:bg-gray-900/50",
      text: "text-gray-800 dark:text-gray-300",
      label: status,
    };

    return (
      <motion.span
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`px-3 py-1 ${config.bg} ${config.text} rounded-full text-sm font-medium flex items-center gap-1`}
      >
        {config.icon}
        {config.label}
      </motion.span>
    );
  };

  if (loading) {
    return <DriftLoading variant="inline" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 px-6 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-extrabold text-center text-teal-700 dark:text-teal-400 mb-12"
        >
          {t("myRides")}
        </motion.h1>

        <AnimatePresence>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </AnimatePresence>

        <div className="space-y-16">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-semibold text-purple-700 dark:text-purple-400 mb-6 flex items-center gap-2">
              <FaUserTie className="text-purple-600 dark:text-purple-500" />{" "}
              {t("ridesAsDriver")}
            </h2>

            {rides.asDriver.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500 dark:text-gray-400 italic"
              >
                {t("noRidesAsDriver")}
              </motion.p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {rides.asDriver.map((ride, index) => {
                  const { date, time: departureTime } = formatDate(
                    ride.departureTime
                  );
                  const { time: arrivalTime } = formatDate(ride.arrivalTime);

                  return (
                    <motion.div
                      key={ride.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-base font-bold text-teal-800 dark:text-teal-400">
                            {ride.pickupLocation} → {ride.dropoffLocation}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {date} ⏰ {departureTime} - {arrivalTime}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                            ₹{ride.price}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {ride.seatsAvailable} {t("seatsAvailable")}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                        <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                          <FaUser className="text-teal-600 dark:text-teal-400" />{" "}
                          {t("bookings")} ({ride.bookings?.length || 0})
                        </h4>
                        <div className="space-y-3">
                          {ride.bookings?.map((booking) => (
                            <motion.div
                              key={booking.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center justify-between py-2 px-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  src={
                                    booking.user?.profilePhoto
                                      ? `http://localhost:5000${booking.user.profilePhoto}`
                                      : "/default-profile.png"
                                  }
                                  alt={booking.user?.name}
                                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/default-profile.png";
                                  }}
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {booking.user?.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {booking.user?.phone}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {renderStatusBadge(booking.status)}
                                {booking.status === "pending" && (
                                  <div className="flex gap-2">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => confirmBooking(booking.id)}
                                      className="bg-green-500 dark:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
                                    >
                                      {t("accept")}
                                    </motion.button>
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => rejectBooking(booking.id)}
                                      className="bg-red-500 dark:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                                    >
                                      {t("reject")}
                                    </motion.button>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        {(!ride.bookings || ride.bookings.length === 0) && (
                          <div className="mt-4 flex justify-end">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => deleteRide(ride.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                            >
                              <FaTrash /> {t("deleteRide")}
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-2xl font-semibold text-purple-700 dark:text-purple-400 mb-6 flex items-center gap-2">
              <FaHourglassHalf className="text-purple-600 dark:text-purple-500" />{" "}
              {t("ridesAsPassenger")}
            </h2>

            {rides.asPassenger.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-gray-500 dark:text-gray-400 italic"
              >
                {t("noRidesAsPassenger")}
              </motion.p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {rides.asPassenger.map((booking, index) => {
                  const { date, time: departureTime } = formatDate(
                    booking.ride?.departureTime
                  );
                  const { time: arrivalTime } = formatDate(
                    booking.ride?.arrivalTime
                  );

                  return (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="text-base font-bold text-teal-800 dark:text-teal-400">
                            {booking.ride?.pickupLocation} →{" "}
                            {booking.ride?.dropoffLocation}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {date} ⏰ {departureTime} - {arrivalTime}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-yellow-600 dark:text-yellow-400">
                            ₹{booking.ride?.price}
                          </p>
                          {renderStatusBadge(booking.status, booking.reviewed)}
                          {booking.status === "pending" && (
                            <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                              {t("waitingForDriverConfirmation")}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              booking.ride?.driver?.profilePhoto
                                ? `http://localhost:5000${booking.ride.driver.profilePhoto}`
                                : "/default-profile.png"
                            }
                            alt={booking.ride?.driver?.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/default-profile.png";
                            }}
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {booking.ride?.driver?.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {booking.ride?.driver?.phone}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {booking.status === "confirmed" && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => completeRide(booking.rideId)}
                              className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 dark:hover:bg-green-700 shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                            >
                              <FaCheckCircle /> {t("completeRide")}
                            </motion.button>
                          )}

                          {booking.status === "completed" &&
                            (booking.reviewed ? (
                              <motion.span
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className="px-4 py-2 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 rounded-lg font-medium shadow-md"
                              >
                                {t("Reviewed")}
                              </motion.span>
                            ) : (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleReviewClick(booking)}
                                className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                              >
                                {t("leaveReview")}
                              </motion.button>
                            ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.section>
        </div>
      </div>

      <AnimatePresence>
        {showReviewModal && selectedRide && (
          <ReviewModal
            ride={selectedRide}
            onClose={() => setShowReviewModal(false)}
            onReviewSubmitted={handleReviewSubmitted}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyRides;
