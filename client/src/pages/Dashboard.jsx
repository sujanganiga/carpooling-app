import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { FaCar, FaUser, FaExchangeAlt, FaClock } from "react-icons/fa";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleRole = async () => {
    setLoading(true);
    setError("");

    try {
      const newMode = !user?.isDriver;
      const response = await api.put("/user/role", {
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

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-white to-teal-100 py-10 px-6 md:px-20">
      <div className="max-w-4xl mx-auto backdrop-blur-md bg-white/80 border border-white/60 shadow-2xl rounded-3xl p-10 animate-fade-in">
        <h1 className="text-4xl font-extrabold text-center text-teal-800 mb-10">
          {t("dashboard")}
        </h1>

        {error && (
          <div
            className={`mb-6 p-4 rounded-xl border shadow-sm text-center text-lg font-medium animate-fade-in transition-all duration-300 ${
              error.includes("success")
                ? "bg-teal-100 text-teal-800 border-teal-300"
                : "bg-red-100 text-red-600 border-red-300"
            }`}
          >
            {error}
          </div>
        )}

        <div className="bg-white shadow-md rounded-2xl p-6 mb-10 grid md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {t("welcome")},{" "}
              <span className="text-teal-600">{user?.name}</span>!
            </h2>
            <p className="text-gray-600 mb-4 text-lg">
              {user?.isDriver
                ? t("youAreInDriverMode")
                : t("youAreInRiderMode")}
            </p>
            <p className="text-gray-600 text-md">
              <span className="font-medium">{t("currentMode")}:</span>{" "}
              <span className="text-teal-700 font-semibold">
                {user?.isDriver ? t("driver") : t("rider")}
              </span>
            </p>
          </div>

          <button
            onClick={toggleRole}
            disabled={loading}
            className={`flex items-center justify-center gap-2 bg-gradient-to-r ${
              user?.isDriver
                ? "from-pink-500 to-red-400"
                : "from-green-400 to-teal-500"
            } text-white px-6 py-3 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50`}
          >
            <FaExchangeAlt />
            {loading
              ? t("switching") + "..."
              : user?.isDriver
              ? t("switchToRiderMode")
              : t("switchToDriverMode")}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <FaCar className="text-indigo-600" />
              {t("quickActions")}
            </h3>

            <div className="space-y-4">
              <button
                onClick={() => navigate("/find-ride")}
                className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition transform hover:scale-105"
              >
                {t("findRide")}
              </button>

              {user?.isDriver ? (
                <button
                  onClick={() => navigate("/offer-ride")}
                  className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition transform hover:scale-105"
                >
                  {t("offerRide")}
                </button>
              ) : (
                <button
                  onClick={toggleRole}
                  className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-400 focus:outline-none transition transform hover:scale-105"
                >
                  {t("becomeDriver")}
                </button>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-gray-800 mb-5 flex items-center gap-2">
              <FaClock className="text-yellow-500" />
              {t("recentActivity")}
            </h3>
            <p className="text-gray-500 italic">{t("noRecentActivity")}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
