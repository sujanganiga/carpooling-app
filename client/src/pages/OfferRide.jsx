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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {t("offerRide")}
        </h1>
        <div className="text-center py-8">
          <p className="text-red-500 mb-4">{t("driverModeRequired")}</p>
          <p className="mb-4">{t("switchToDriverModeMessage")}</p>
          <Link to="/profile" className="btn-primary">
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {t("offerRide")}
      </h1>

      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md mb-6">
          {t("rideOfferedSuccessfully")}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("pickupLocation")}
            </label>
            <input
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
              required
              className="input-field"
              placeholder={t("enterPickupLocation")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("dropoffLocation")}
            </label>
            <input
              name="dropoffLocation"
              value={formData.dropoffLocation}
              onChange={handleChange}
              required
              className="input-field"
              placeholder={t("enterDropoffLocation")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("departureTime")}
            </label>
            <input
              type="datetime-local"
              name="departureTime"
              value={formData.departureTime}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("arrivalTime")}
            </label>
            <input
              type="datetime-local"
              name="arrivalTime"
              value={formData.arrivalTime}
              onChange={handleChange}
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("pricePerSeat")}
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="input-field"
              placeholder={t("enterPricePerSeat")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("totalSeats")}
            </label>
            <input
              type="number"
              name="seatsAvailable"
              value={formData.seatsAvailable}
              onChange={handleChange}
              required
              className="input-field"
              placeholder={t("enterTotalSeats")}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? t("offeringRide") + "..." : t("offerRideBtn")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OfferRide;
