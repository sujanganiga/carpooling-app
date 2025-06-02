import React from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {t("dashboard")}
      </h1>

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
          <button onClick={() => {}} className="btn-secondary">
            {user?.isDriver ? t("switchToRiderMode") : t("switchToDriverMode")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t("quickActions")}
          </h3>
          <div className="space-y-3">
            <button className="btn-primary w-full">{t("findRide")}</button>
            <button className="btn-primary w-full">{t("offerRide")}</button>
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
