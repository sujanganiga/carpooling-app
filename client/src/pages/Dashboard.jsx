import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { motion } from "framer-motion";
import {
  FaCar,
  FaUser,
  FaExchangeAlt,
  FaClock,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaStar,
  FaLeaf,
  FaExclamationTriangle,
  FaInfoCircle,
  FaSpinner,
  FaCheck,
} from "react-icons/fa";
import DriftLoading from "../components/DriftLoading";

const CARPOOL_SIZE = 4; // average carpool size
const CO2_PER_KM = 0.251; // kg CO2 per km

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState({
    initial: true,
    roleSwitch: false,
    activities: false,
  });
  const [error, setError] = useState("");
  const [recentActivities, setRecentActivities] = useState({
    items: [],
    total: 0,
  });
  const [carbonSaved, setCarbonSaved] = useState(0);
  const [stats, setStats] = useState({
    totalRides: 0,
    completedRides: 0,
    totalDistance: 0,
    averageRating: 0,
  });

  const calculateCarbonSaved = (rides) => {
    if (!rides || !Array.isArray(rides)) return "0.00";
    const totalDistance = rides.reduce(
      (sum, ride) => sum + (parseFloat(ride.distance) || 0),
      0
    );
    const totalCarbonSaved = (totalDistance * CO2_PER_KM) / CARPOOL_SIZE;
    return totalCarbonSaved.toFixed(2);
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get("/api/rides/my-rides");
      const allRides = [
        ...(response.data.asDriver || []),
        ...(response.data.asPassenger || []),
      ];

      const stats = {
        totalRides: allRides.length,
        completedRides: allRides.filter((ride) => ride.status === "completed")
          .length,
        totalDistance: allRides.reduce(
          (sum, ride) => sum + (parseFloat(ride.distance) || 0),
          0
        ),
        averageRating: user?.rating || 0,
      };

      setStats(stats);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    }
  };

  const fetchRecentActivities = async () => {
    setLoading((prev) => ({ ...prev, activities: true }));
    try {
      const [ridesResponse, reviewsResponse] = await Promise.all([
        api.get("/api/rides/my-rides"),
        api.get(`/api/reviews/user/${user.id}`),
      ]);

      const allRides = [
        ...(ridesResponse.data.asDriver || []),
        ...(ridesResponse.data.asPassenger || []),
      ];

      const allReviews = reviewsResponse.data || [];
      const allActivities = [
        ...allRides.map((r) => ({
          ...r,
          _type: "ride",
          pickupLocation: r.pickupLocation || r.ride?.pickupLocation,
          dropoffLocation: r.dropoffLocation || r.ride?.dropoffLocation,
          distance: r.distance || r.ride?.distance,
          createdAt: r.createdAt || r.ride?.createdAt,
        })),
        ...allReviews.map((r) => ({ ...r, _type: "review" })),
      ];

      allActivities.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const carbonSavedKg = calculateCarbonSaved(allRides);
      setCarbonSaved(carbonSavedKg);

      setRecentActivities({
        items: allActivities[0] ? [allActivities[0]] : [],
        total: allActivities.length,
      });
    } catch (err) {
      console.error("Error fetching recent activities:", err);
      setError(t("errorFetchingActivities"));
    } finally {
      setLoading((prev) => ({ ...prev, activities: false }));
    }
  };

  useEffect(() => {
    const initializeDashboard = async () => {
      setLoading((prev) => ({ ...prev, initial: true }));
      try {
        await Promise.all([fetchDashboardStats(), fetchRecentActivities()]);
      } catch (err) {
        console.error("Error initializing dashboard:", err);
        setError(t("errorInitializingDashboard"));
      } finally {
        setLoading((prev) => ({ ...prev, initial: false }));
      }
    };

    if (user?.id) {
      initializeDashboard();
    }
  }, [user?.id]);

  const toggleRole = async () => {
    setLoading((prev) => ({ ...prev, roleSwitch: true }));
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
      setLoading((prev) => ({ ...prev, roleSwitch: false }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return { date: "N/A", time: "N/A" };
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
      };
    } catch (err) {
      console.error("Error formatting date:", err);
      return { date: "Invalid Date", time: "Invalid Time" };
    }
  };

  if (loading.initial) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 via-white to-teal-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <DriftLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-white to-teal-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 px-6 md:px-20">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-extrabold text-center text-teal-800 dark:text-teal-400"
        >
          {t("dashboard")}
        </motion.h1>

        {/* Error Banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-xl border shadow-sm text-center text-lg font-medium animate-fade-in transition-all duration-300 ${
              error.includes("success")
                ? "bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 border-teal-300 dark:border-teal-700"
                : "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300 border-red-300 dark:border-red-700"
            }`}
          >
            {error}
          </motion.div>
        )}

        {/* Stats and Mode Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Welcome Message */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                {t("welcome")},{" "}
                <span className="text-teal-600 dark:text-teal-400">
                  {user?.name}
                </span>
                !
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                {user?.isDriver
                  ? t("youAreInDriverMode")
                  : t("youAreInPassengerMode")}
              </p>
            </div>

            {/* Stat Cards */}
            {[
              {
                icon: (
                  <FaMapMarkerAlt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                ),
                label: t("totalDistance"),
                value: `${Number(stats.totalDistance).toFixed(2)} km`,
                bg: "bg-blue-100 dark:bg-blue-900/50",
              },
              {
                icon: <FaLeaf className="w-6 h-6" />,
                label: t("carbonSaved"),
                value: `${carbonSaved} kg CO₂`,
                gradient: true,
              },
              {
                icon: (
                  <FaExchangeAlt className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                ),
                label: t("currentMode"),
                value: user?.isDriver ? t("driverMode") : t("passengerMode"),
                action: (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleRole}
                    disabled={loading.roleSwitch}
                    className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-green-500 dark:from-teal-600 dark:to-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading.roleSwitch ? (
                      <FaSpinner className="animate-spin w-4 h-4" />
                    ) : (
                      <FaExchangeAlt className="w-4 h-4" />
                    )}
                    {loading.roleSwitch
                      ? t("switching") + "..."
                      : user?.isDriver
                      ? t("switchToPassengerMode")
                      : t("switchToDriverMode")}
                  </motion.button>
                ),
                bg: "bg-indigo-100 dark:bg-indigo-900/50",
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                className={`p-6 ${
                  card.gradient
                    ? "bg-gradient-to-r from-green-500 to-teal-500 dark:from-green-600 dark:to-teal-600 text-white"
                    : "bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                } rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-600`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`p-3 rounded-xl ${
                      card.gradient ? "bg-white/20" : card.bg
                    }`}
                  >
                    {card.icon}
                  </div>
                  <p
                    className={`text-sm font-medium ${
                      card.gradient
                        ? "opacity-90"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {card.label}
                  </p>
                </div>
                <div className="text-2xl font-bold">{card.value}</div>
                {card.action}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action and Activity Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            {loading.activities ? (
              <div className="flex justify-center items-center py-8">
                <FaSpinner className="animate-spin w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            ) : recentActivities.items.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.items.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    {activity._type === "ride" ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FaCar className="text-indigo-600 dark:text-indigo-400" />
                          <span className="font-medium">
                            {activity.status === "completed"
                              ? t("completedRide")
                              : t("upcomingRide")}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(activity.createdAt).date} -{" "}
                          {formatDate(activity.createdAt).time}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FaStar className="text-yellow-500 dark:text-yellow-400" />
                          <span className="font-medium">{t("newReview")}</span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(activity.createdAt).date} -{" "}
                          {formatDate(activity.createdAt).time}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {t("noRecentActivity")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
