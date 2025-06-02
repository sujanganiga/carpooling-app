import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const OfferRide = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    seatsAvailable: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // If user is not in driver mode, show message
  if (!user?.isDriver) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
          {t("offerRide")}
        </h1>
        <div className="text-center py-8">
          <p className="text-red-500 font-semibold mb-4">
            {t("driverModeRequired")}
          </p>
          <p className="text-gray-600 mb-4">{t("switchToDriverModeMessage")}</p>
          <Link
            to="/profile"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
          >
            {t("goToProfile")}
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await api.post("/rides", formData);
      setSuccess(true);
      setFormData({
        pickupLocation: "",
        dropoffLocation: "",
        departureTime: "",
        arrivalTime: "",
        price: "",
        seatsAvailable: "",
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || t("offerFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
        {t("offerRide")}
      </h1>

      {success && (
        <div className="bg-teal-50 text-teal-700 p-4 rounded-lg mb-6 border border-teal-200 animate-fade-in">
          {t("rideOfferedSuccessfully")}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 border border-red-200 animate-fade-in">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("pickupLocation")}
            </label>
            <input
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder={t("enterPickupLocation")}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("dropoffLocation")}
            </label>
            <input
              name="dropoffLocation"
              value={formData.dropoffLocation}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder={t("enterDropoffLocation")}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("departureTime")}
            </label>
            <input
              type="datetime-local"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("arrivalTime")}
            </label>
            <input
              type="datetime-local"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("pricePerSeat")}
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder={t("enterPricePerSeat")}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t("totalSeats")}
            </label>
            <input
              type="number"
              name="seatsAvailable"
              value={formData.seatsAvailable}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder={t("enterTotalSeats")}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:bg-gray-400"
          >
            {loading ? t("offeringRide") + "..." : t("offerRideBtn")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OfferRide;
