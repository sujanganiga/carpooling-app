import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import {
  FaCar,
  FaUser,
  FaExchangeAlt,
  FaClock,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaStar,
  FaLeaf,
} from "react-icons/fa";

const CARPOOL_SIZE = 4; // average carpool size
const CO2_PER_KM = 0.251; // kg CO2 per km

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentActivities, setRecentActivities] = useState({
    items: [],
  });
  const [carbonSaved, setCarbonSaved] = useState(0);

  const calculateCarbonSaved = (rides) => {
    // Sum the actual distance field from all rides
    const totalDistance = rides.reduce(
      (sum, ride) => sum + (parseFloat(ride.distance) || 0),
      0
    );
    const totalCarbonSaved = (totalDistance * CO2_PER_KM) / CARPOOL_SIZE;
    return totalCarbonSaved.toFixed(2);
  };

  const fetchRecentActivities = async () => {
    try {
      const [ridesResponse, reviewsResponse] = await Promise.all([
        api.get("/api/rides/my-rides"),
        api.get(`/api/reviews/user/${user.id}`),
      ]);

      // Combine all rides and reviews, sort by createdAt, and pick the most recent
      const allRides = [
        ...ridesResponse.data.asDriver,
        ...ridesResponse.data.asPassenger,
      ];
      const allReviews = reviewsResponse.data;
      const allActivities = [
        ...allRides.map((r) => ({ ...r, _type: "ride" })),
        ...allReviews.map((r) => ({ ...r, _type: "review" })),
      ];
      allActivities.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      const mostRecent = allActivities[0] ? [allActivities[0]] : [];

      // Calculate carbon saved from all rides
      const carbonSavedKg = calculateCarbonSaved(allRides);
      setCarbonSaved(carbonSavedKg);

      setRecentActivities({
        items: mostRecent,
      });
    } catch (err) {
      console.error("Error fetching recent activities:", err);
    }
  };

  useEffect(() => {
    fetchRecentActivities();
  }, [user.id]);

  const toggleRole = async () => {
    setLoading(true);
    setError("");

    try {
      const newMode = !user?.isDriver;
      const response = await api.put("/api/user/role", {
        isDriver: newMode,
      });

      updateUser(response.data.user);
      setError(t("roleSwitchedSuccessfully"));
      setTimeout(() => setError(""), 3000);
    } catch (err) {
      console.error("Toggle role error:", err);
      setError(err.response?.data?.message || t("toggleFailed"));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-white to-teal-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 px-6 md:px-20">
      <div className="max-w-4xl mx-auto backdrop-blur-md bg-white/80 dark:bg-gray-800/80 border border-white/60 dark:border-gray-700/60 shadow-2xl rounded-3xl p-10 animate-fade-in">
        <h1 className="text-4xl font-extrabold text-center text-teal-800 dark:text-teal-400 mb-10">
          {t("dashboard")}
        </h1>

        {error && (
          <div
            className={`mb-6 p-4 rounded-xl border shadow-sm text-center text-lg font-medium animate-fade-in transition-all duration-300 ${
              error.includes("success")
                ? "bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-700"
                : "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 border-red-300 dark:border-red-700"
            }`}
          >
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 mb-10 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              {t("welcome")},{" "}
              <span className="text-teal-600 dark:text-teal-400">
                {user?.name}
              </span>
              !
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
              {user?.isDriver
                ? t("youAreInPassengerMode")
                : t("youAreInPassengerMode")}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-md">
              <span className="font-medium">{t("currentMode")}:</span>{" "}
              <span className="text-teal-700 dark:text-teal-400 font-semibold">
                {user?.isDriver ? t("driver") : t("passenger")}
              </span>
            </p>
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-100 dark:border-green-800">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <FaLeaf className="text-green-600 dark:text-green-500" />
                <span className="font-medium">
                  {t("carbonSaved")}: {carbonSaved} kg CO₂
                </span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                {t("carbonSavedDescription")}
              </p>
            </div>
          </div>

          <button
            onClick={toggleRole}
            disabled={loading}
            className={`flex items-center justify-center gap-2 bg-gradient-to-r ${
              user?.isDriver
                ? "from-pink-500 to-red-400 dark:from-pink-600 dark:to-red-500"
                : "from-green-400 to-teal-500 dark:from-green-500 dark:to-teal-600"
            } text-white px-6 py-3 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50`}
          >
            <FaExchangeAlt />
            {loading
              ? t("switching") + "..."
              : user?.isDriver
              ? t("switchToPassengerMode")
              : t("switchToDriverMode")}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-5 flex items-center gap-2">
              <FaCar className="text-indigo-600 dark:text-indigo-400" />
              {t("quickActions")}
            </h3>

            <div className="space-y-4">
              <button
                onClick={() => navigate("/find-ride")}
                className="w-full bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:outline-none transition transform hover:scale-105"
              >
                {t("findRide")}
              </button>

              {user?.isDriver ? (
                <button
                  onClick={() => navigate("/offer-ride")}
                  className="w-full bg-indigo-600 dark:bg-indigo-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:outline-none transition transform hover:scale-105"
                >
                  {t("offerRide")}
                </button>
              ) : (
                <button
                  onClick={toggleRole}
                  className="w-full bg-green-600 dark:bg-green-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 dark:hover:bg-green-600 focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 focus:outline-none transition transform hover:scale-105"
                >
                  {t("becomeDriver")}
                </button>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-5 flex items-center gap-2">
              <FaClock className="text-yellow-500 dark:text-yellow-400" />
              {t("recentActivity")}
            </h3>

            {!recentActivities.items || recentActivities.items.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 italic">
                {t("noRecentActivity")}
              </p>
            ) : (
              <div className="space-y-4">
                {recentActivities.items.map((activity) => {
                  if (activity._type === "ride") {
                    const { date, time } = formatDate(activity.createdAt);
                    const isDriver = activity.createdBy === user.id;
                    return (
                      <div
                        key={activity.id}
                        className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              isDriver
                                ? "bg-indigo-100 dark:bg-indigo-900/50"
                                : "bg-green-100 dark:bg-green-900/50"
                            }`}
                          >
                            {isDriver ? (
                              <FaCar className="text-indigo-600 dark:text-indigo-400" />
                            ) : (
                              <FaUser className="text-green-600 dark:text-green-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {isDriver
                                ? t("youOfferedRide")
                                : t("youBookedRide")}
                            </p>
                            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              <p className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-gray-400 dark:text-gray-500" />
                                {activity.pickupLocation} →{" "}
                                {activity.dropoffLocation}
                              </p>
                              <p className="flex items-center gap-2 mt-1">
                                <FaCalendarAlt className="text-gray-400 dark:text-gray-500" />
                                {date} {time}
                              </p>
                              <p className="flex items-center gap-2 mt-1">
                                <span className="text-green-700 dark:text-green-400 font-semibold">
                                  {t("distance")}: {activity.distance} km
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (activity._type === "review") {
                    return (
                      <div
                        key={activity.id}
                        className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-0"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/50">
                            <FaStar className="text-yellow-500 dark:text-yellow-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                {t("newReview")}
                              </p>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < activity.rating
                                        ? "text-yellow-500 dark:text-yellow-400"
                                        : "text-gray-300 dark:text-gray-600"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              {activity.comment || t("noComment")}
                            </p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                              {formatDate(activity.createdAt).date}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
