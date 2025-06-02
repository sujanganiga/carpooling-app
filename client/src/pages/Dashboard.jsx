import React from "react";
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
