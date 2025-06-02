/*import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const toggleRole = async () => {
    setLoading(true);
    setError("");

    try {
      const newMode = !user?.isDriver;
      const response = await api.put("/user/role", {
        isDriver: newMode,
      });

      updateUser(response.data.user);

      // Show success feedback
      setTimeout(() => {
        setError("");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || t("toggleFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {t("dashboard")}
      </h1>

      {error && (
        <div
          className={`mb-4 p-3 rounded-md ${
            error.includes("success")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-500"
          }`}
        >
          {error}
        </div>
      )}

      <div className="bg-primary-50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {t("welcome")}, {user?.name}!
        </h2>
        <p className="text-gray-700 mb-4">
          {user?.isDriver ? t("youAreInDriverMode") : t("youAreInRiderMode")}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-gray-700">
            <span className="font-medium">{t("currentMode")}: </span>
            {user?.isDriver ? t("driver") : t("rider")}
          </span>
          <button
            onClick={toggleRole}
            disabled={loading}
            className="btn-secondary"
          >
            {loading
              ? t("switching") + "..."
              : user?.isDriver
              ? t("switchToRiderMode")
              : t("switchToDriverMode")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t("quickActions")}
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/find-ride")}
              className="btn-primary w-full"
            >
              {t("findRide")}
            </button>

            {user?.isDriver && (
              <button
                onClick={() => navigate("/offer-ride")}
                className="btn-primary w-full"
              >
                {t("offerRide")}
              </button>
            )}
          </div>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t("recentActivity")}
          </h3>
          <p className="text-gray-500 italic">{t("noRecentActivity")}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
*/

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

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

      // Show success feedback
      setError(t("roleSwitchedSuccessfully"));
      setTimeout(() => {
        setError("");
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || t("toggleFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
        {t("dashboard")}
      </h1>

      {error && (
        <div
          className={`mb-6 p-4 rounded-lg border animate-fade-in ${
            error.includes("success")
              ? "bg-teal-50 text-teal-700 border-teal-200"
              : "bg-red-50 text-red-500 border-red-200"
          }`}
        >
          {error}
        </div>
      )}

      <div className="bg-gradient-to-r from-indigo-50 to-teal-50 rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          {t("welcome")}, {user?.name}!
        </h2>
        <p className="text-gray-600 mb-4">
          {user?.isDriver ? t("youAreInDriverMode") : t("youAreInRiderMode")}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">
            <span className="font-semibold">{t("currentMode")}: </span>
            {user?.isDriver ? t("driver") : t("rider")}
          </span>
          <button
            onClick={toggleRole}
            disabled={loading}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:bg-gray-400"
          >
            {loading
              ? t("switching") + "..."
              : user?.isDriver
              ? t("switchToRiderMode")
              : t("switchToDriverMode")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("quickActions")}
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/find-ride")}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
            >
              {t("findRide")}
            </button>

            {user?.isDriver && (
              <button
                onClick={() => navigate("/offer-ride")}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
              >
                {t("offerRide")}
              </button>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {t("recentActivity")}
          </h3>
          <p className="text-gray-500 italic">{t("noRecentActivity")}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
