/*
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../utils/api";

const MyRides = () => {
  const { t } = useTranslation();
  const [rides, setRides] = useState({
    asDriver: [],
    asRider: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMyRides = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/rides/my-rides");
      setRides(response.data);
    } catch (err) {
      setError(err.response?.data?.message || t("loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  const completeRide = async (bookingId) => {
    if (window.confirm(t("confirmCompleteRide"))) {
      try {
        await api.post(`/rides/${bookingId}/complete`);
        alert(t("rideCompletedSuccessfully"));
        fetchMyRides(); // Refresh the list
      } catch (err) {
        alert(err.response?.data?.message || t("completionFailed"));
      }
    }
  };

  useEffect(() => {
    fetchMyRides();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("myRides")}</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <p>{t("loading")}...</p>
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t("ridesAsDriver")}
            </h2>

            {rides.asDriver.length === 0 ? (
              <p className="text-gray-500">{t("noRidesAsDriver")}</p>
            ) : (
              <div className="space-y-4">
                {rides.asDriver.map((ride) => (
                  <div key={ride.id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {ride.pickupLocation} → {ride.dropoffLocation}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(ride.departureTime).toLocaleString()} -{" "}
                          {new Date(ride.arrivalTime).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ₹{ride.price} {t("perSeat")}
                        </p>
                        <p className="text-sm">
                          {ride.seatsAvailable} {t("seatsAvailable")}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium text-gray-700 mb-2">
                        {t("bookings")} ({ride.bookings?.length || 0})
                      </h4>
                      {ride.bookings?.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex items-center justify-between py-2 border-b border-gray-100"
                        >
                          <div className="flex items-center">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                            <div className="ml-2">
                              <p className="text-sm font-medium">
                                {booking.user?.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {booking.user?.phone}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              booking.status === "confirmed"
                                ? "bg-yellow-100 text-yellow-800"
                                : booking.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {t("ridesAsRider")}
            </h2>

            {rides.asRider.length === 0 ? (
              <p className="text-gray-500">{t("noRidesAsRider")}</p>
            ) : (
              <div className="space-y-4">
                {rides.asRider.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {booking.ride?.pickupLocation} →{" "}
                          {booking.ride?.dropoffLocation}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(
                            booking.ride?.departureTime
                          ).toLocaleString()}{" "}
                          -{" "}
                          {new Date(
                            booking.ride?.arrivalTime
                          ).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{booking.ride?.price}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            booking.status === "confirmed"
                              ? "bg-yellow-100 text-yellow-800"
                              : booking.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8" />
                        <div className="ml-2">
                          <p className="text-sm font-medium">
                            {booking.ride?.driver?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.ride?.driver?.phone}
                          </p>
                        </div>
                      </div>

                      {booking.status === "confirmed" && (
                        <button
                          onClick={() => completeRide(booking.rideId)}
                          className="btn-primary text-sm"
                        >
                          {t("completeRide")}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRides;
*/

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../utils/api";

const MyRides = () => {
  const { t } = useTranslation();
  const [rides, setRides] = useState({
    asDriver: [],
    asRider: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMyRides = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/rides/my-rides");
      setRides(response.data);
    } catch (err) {
      setError(err.response?.data?.message || t("loadFailed"));
    } finally {
      setLoading(false);
    }
  };

  const completeRide = async (bookingId) => {
    if (window.confirm(t("confirmCompleteRide"))) {
      try {
        await api.post(`/rides/${bookingId}/complete`);
        alert(t("rideCompletedSuccessfully"));
        fetchMyRides();
      } catch (err) {
        alert(err.response?.data?.message || t("completionFailed"));
      }
    }
  };

  useEffect(() => {
    fetchMyRides();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">
        {t("myRides")}
      </h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 border border-red-200 animate-fade-in">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-700 mx-auto"></div>
          <p className="text-gray-600 text-sm mt-2">{t("loading")}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Rides as Driver */}
          <div>
            <h2 className="text-base font-medium text-gray-800 mb-4">
              {t("ridesAsDriver")}
            </h2>

            {rides.asDriver.length === 0 ? (
              <p className="text-gray-500 text-sm">{t("noRidesAsDriver")}</p>
            ) : (
              <div className="space-y-4">
                {rides.asDriver.map((ride) => (
                  <div
                    key={ride.id}
                    className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {ride.pickupLocation} → {ride.dropoffLocation}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(ride.departureTime).toLocaleString()} -{" "}
                          {new Date(ride.arrivalTime).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-blue-700">
                          ₹{ride.price} {t("perSeat")}
                        </p>
                        <p className="text-sm text-gray-500">
                          {ride.seatsAvailable} {t("seatsAvailable")}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <h4 className="font-medium text-gray-700 text-sm mb-2">
                        {t("bookings")} ({ride.bookings?.length || 0})
                      </h4>
                      {ride.bookings?.map((booking) => (
                        <div
                          key={booking.id}
                          className="flex items-center justify-between py-2 border-b border-gray-100"
                        >
                          <div className="flex items-center">
                            <div className="bg-gray-100 border-2 border-dashed rounded-lg w-8 h-8" />
                            <div className="ml-2">
                              <p className="text-sm font-medium text-gray-800">
                                {booking.user?.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {booking.user?.phone}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded ${
                              booking.status === "confirmed"
                                ? "bg-yellow-100 text-yellow-800"
                                : booking.status === "completed"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Rides as Rider */}
          <div>
            <h2 className="text-base font-medium text-gray-800 mb-4">
              {t("ridesAsRider")}
            </h2>

            {rides.asRider.length === 0 ? (
              <p className="text-gray-500 text-sm">{t("noRidesAsRider")}</p>
            ) : (
              <div className="space-y-4">
                {rides.asRider.map((booking) => (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {booking.ride?.pickupLocation} →{" "}
                          {booking.ride?.dropoffLocation}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(
                            booking.ride?.departureTime
                          ).toLocaleString()}{" "}
                          -{" "}
                          {new Date(
                            booking.ride?.arrivalTime
                          ).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-blue-700">
                          ₹{booking.ride?.price}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            booking.status === "confirmed"
                              ? "bg-yellow-100 text-yellow-800"
                              : booking.status === "completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-gray-100 border-2 border-dashed rounded-lg w-8 h-8" />
                        <div className="ml-2">
                          <p className="text-sm font-medium text-gray-800">
                            {booking.ride?.driver?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.ride?.driver?.phone}
                          </p>
                        </div>
                      </div>

                      {booking.status === "confirmed" && (
                        <button
                          onClick={() => completeRide(booking.rideId)}
                          className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 text-sm"
                        >
                          {t("completeRide")}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRides;
