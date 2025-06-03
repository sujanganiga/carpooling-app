/*import React, { useState } from "react";
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

  if (!user?.isDriver) {
    return (
      <div className="bg-gradient-to-br from-indigo-100 via-white to-purple-100 rounded-xl shadow-2xl p-10 animate-fade-in">
        <h1 className="text-4xl font-bold text-indigo-900 mb-6 text-center">
          {t("offerRide")}
        </h1>
        <div className="text-center py-6">
          <p className="text-red-600 text-lg font-semibold mb-3">
            {t("driverModeRequired")}
          </p>
          <p className="text-gray-700 mb-5 italic">
            {t("switchToDriverModeMessage")}
          </p>
          <Link
            to="/profile"
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300"
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
    <div className="bg-gradient-to-br from-white via-indigo-50 to-purple-50 rounded-xl shadow-xl p-10 animate-fade-in">
      <h1 className="text-4xl font-extrabold text-indigo-800 mb-8 text-center">
        {t("offerRide")}
      </h1>

      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6 border border-green-300 animate-fade-in">
          {t("rideOfferedSuccessfully")}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-300 animate-fade-in">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 animate-slide-in-up transition-all duration-500"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              label: t("pickupLocation"),
              name: "pickupLocation",
              type: "text",
              placeholder: t("enterPickupLocation"),
            },
            {
              label: t("dropoffLocation"),
              name: "dropoffLocation",
              type: "text",
              placeholder: t("enterDropoffLocation"),
            },
            {
              label: t("departureTime"),
              name: "departureTime",
              type: "datetime-local",
              placeholder: "",
            },
            {
              label: t("arrivalTime"),
              name: "arrivalTime",
              type: "datetime-local",
              placeholder: "",
            },
            {
              label: t("pricePerSeat"),
              name: "price",
              type: "number",
              placeholder: t("enterPricePerSeat"),
            },
            {
              label: t("totalSeats"),
              name: "seatsAvailable",
              type: "number",
              placeholder: t("enterTotalSeats"),
            },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name} className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
                {label}
              </label>
              <input
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:border-transparent transition-all duration-200"
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300 disabled:bg-gray-400"
          >
            {loading ? t("offeringRide") + "..." : t("offerRideBtn")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OfferRide;*/

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

  if (!user?.isDriver) {
    return (
      <div className="bg-gradient-to-br from-indigo-100 via-white to-purple-100 rounded-xl shadow-2xl p-10 animate-fade-in">
        <h1 className="text-4xl font-bold text-indigo-900 mb-6 text-center">
          {t("offerRide")}
        </h1>
        <div className="text-center py-6">
          <p className="text-red-600 text-lg font-semibold mb-3">
            {t("driverModeRequired")}
          </p>
          <p className="text-gray-700 mb-5 italic">
            {t("switchToDriverModeMessage")}
          </p>
          <Link
            to="/profile"
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300"
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
    <div className="bg-gradient-to-br from-white via-indigo-50 to-purple-50 rounded-xl shadow-xl p-10 animate-fade-in">
      <h1 className="text-4xl font-extrabold text-indigo-800 mb-8 text-center">
        {t("offerRide")}
      </h1>

      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6 border border-green-300 animate-fade-in">
          {t("rideOfferedSuccessfully")}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-300 animate-fade-in">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 animate-slide-in-up transition-all duration-500"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              label: t("pickupLocation"),
              name: "pickupLocation",
              type: "text",
              placeholder: t("enterPickupLocation"),
            },
            {
              label: t("dropoffLocation"),
              name: "dropoffLocation",
              type: "text",
              placeholder: t("enterDropoffLocation"),
            },
            {
              label: t("departureTime"),
              name: "departureTime",
              type: "datetime-local",
              placeholder: "",
            },
            {
              label: t("arrivalTime"),
              name: "arrivalTime",
              type: "datetime-local",
              placeholder: "",
            },
            {
              label: t("pricePerSeat"),
              name: "price",
              type: "number",
              placeholder: t("enterPricePerSeat"),
            },
            {
              label: t("totalSeats"),
              name: "seatsAvailable",
              type: "number",
              placeholder: t("enterTotalSeats"),
            },
          ].map(({ label, name, type, placeholder }) => (
            <div key={name} className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
                {label}
              </label>
              <input
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:border-transparent transition-all duration-200"
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300 disabled:bg-gray-400"
          >
            {loading ? t("offeringRide") + "..." : t("offerRideBtn")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OfferRide;
