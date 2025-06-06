import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
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
} from "react-icons/fa";
import ReviewModal from "../components/ReviewModal";
import DriftLoading from "../components/DriftLoading";

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

  const fetchMyRides = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/api/rides/my-rides");
      setRides(response.data);
    } catch (err) {
      setError(err.response?.data?.message || t("loadFailed"));
      console.error("Error fetching rides:", err);
    } finally {
      setLoading(false);
    }
  };

  const completeRide = async (rideId) => {
    if (window.confirm(t("confirmCompleteRide"))) {
      try {
        await api.post(`/api/rides/${rideId}/complete`);
        alert(t("rideCompletedSuccessfully"));
        fetchMyRides();
      } catch (err) {
        alert(err.response?.data?.message || t("completionFailed"));
      }
    }
  };

  const confirmBooking = async (bookingId) => {
    if (window.confirm(t("confirmBookingRequest"))) {
      try {
        await api.post(`/api/rides/bookings/${bookingId}/confirm`);
        alert(t("bookingConfirmedSuccessfully"));
        fetchMyRides();
      } catch (err) {
        alert(err.response?.data?.message || t("confirmationFailed"));
      }
    }
  };

  const rejectBooking = async (bookingId) => {
    if (window.confirm(t("confirmRejectBooking"))) {
      try {
        console.log("Attempting to reject booking:", bookingId);
        const response = await api.post(
          `/api/rides/bookings/${bookingId}/reject`
        );
        console.log("Reject booking response:", response.data);
        alert(t("bookingRejectedSuccessfully"));
        fetchMyRides();
      } catch (err) {
        console.error("Error rejecting booking:", err);
        const errorMessage =
          err.response?.data?.message || t("rejectionFailed");
        alert(errorMessage);
      }
    }
  };

  const deleteRide = async (rideId) => {
    if (window.confirm(t("confirmDeleteRide"))) {
      try {
        await api.delete(`/api/rides/${rideId}`);
        alert(t("rideDeletedSuccessfully"));
        fetchMyRides();
      } catch (err) {
        alert(err.response?.data?.message || t("deletionFailed"));
      }
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
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
    };
  };

  const renderStatusBadge = (status, reviewed) => {
    // if (reviewed) {
    //   return (
    //     <span className="px-3 py-1 bg-green-100 text-red-800 rounded-full text-sm font-medium">
    //       {t("review.reviewed")}
    //     </span>
    //   );
    // }

    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium flex items-center gap-1">
            <FaClock className="text-yellow-600" />
            {t("pending")}
          </span>
        );
      case "upcoming":
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {t("upcoming")}
          </span>
        );
      case "confirmed":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {t("confirmed")}
          </span>
        );
      case "in-progress":
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
            {t("inProgress")}
          </span>
        );
      case "completed":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            {t("completed")}
          </span>
        );
      case "cancelled":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
            {t("cancelled")}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return <DriftLoading variant="inline" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 px-6 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-teal-700 dark:text-teal-400 mb-12 animate-fade-in">
          {t("myRides")}
        </h1>

        {error && (
          <div className="max-w-3xl mx-auto bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 p-4 rounded-lg mb-8 border border-red-300 dark:border-red-700 animate-fade-in">
            {error}
          </div>
        )}

        <div className="space-y-16">
          <section className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-lg p-8 animate-slide-in-up">
            <h2 className="text-2xl font-semibold text-purple-700 dark:text-purple-400 mb-6 flex items-center gap-2">
              <FaUserTie className="text-purple-600 dark:text-purple-500" />{" "}
              {t("ridesAsDriver")}
            </h2>

            {rides.asDriver.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 italic">
                {t("noRidesAsDriver")}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {rides.asDriver.map((ride) => {
                  const { date, time: departureTime } = formatDate(
                    ride.departureTime
                  );
                  const { time: arrivalTime } = formatDate(ride.arrivalTime);

                  return (
                    <div
                      key={ride.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300"
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
                            <div
                              key={booking.id}
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
                                    <button
                                      onClick={() => confirmBooking(booking.id)}
                                      className="bg-green-500 dark:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-600 dark:hover:bg-green-700 transition-colors"
                                    >
                                      {t("accept")}
                                    </button>
                                    <button
                                      onClick={() => rejectBooking(booking.id)}
                                      className="bg-red-500 dark:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                                    >
                                      {t("reject")}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                        {(!ride.bookings || ride.bookings.length === 0) && (
                          <div className="mt-4 flex justify-end">
                            <button
                              onClick={() => deleteRide(ride.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-red-500 dark:bg-red-600 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-colors"
                            >
                              <FaTrash /> {t("deleteRide")}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl shadow-lg p-8 animate-slide-in-up">
            <h2 className="text-2xl font-semibold text-purple-700 dark:text-purple-400 mb-6 flex items-center gap-2">
              <FaHourglassHalf className="text-purple-600 dark:text-purple-500" />{" "}
              {t("ridesAsPassenger")}
            </h2>

            {rides.asPassenger.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 italic">
                {t("noRidesAsPassenger")}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {rides.asPassenger.map((booking) => {
                  const { date, time: departureTime } = formatDate(
                    booking.ride?.departureTime
                  );
                  const { time: arrivalTime } = formatDate(
                    booking.ride?.arrivalTime
                  );

                  return (
                    <div
                      key={booking.id}
                      className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300"
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
                            <button
                              onClick={() => completeRide(booking.rideId)}
                              className="bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 dark:hover:bg-green-700 shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                            >
                              <FaCheckCircle /> {t("completeRide")}
                            </button>
                          )}

                          {booking.status === "completed" &&
                            (booking.reviewed ? (
                              <span className="px-4 py-2 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 rounded-lg font-medium shadow-md">
                                {t("Reviewed")}
                              </span>
                            ) : (
                              <button
                                onClick={() => handleReviewClick(booking)}
                                className="bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                              >
                                {t("leaveReview")}
                              </button>
                            ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      {showReviewModal && selectedRide && (
        <ReviewModal
          ride={selectedRide}
          onClose={() => setShowReviewModal(false)}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
};

export default MyRides;
