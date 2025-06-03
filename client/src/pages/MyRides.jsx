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
*/

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../utils/api";
import {
  FaUserTie,
  FaUser,
  FaCheckCircle,
  FaHourglassHalf,
} from "react-icons/fa";

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 py-10 px-6 lg:px-20">
      <h1 className="text-4xl font-extrabold text-center text-teal-700 mb-12 animate-fade-in">
        {t("myRides")}
      </h1>

      {error && (
        <div className="max-w-3xl mx-auto bg-red-100 text-red-700 p-4 rounded-lg mb-8 border border-red-300 animate-fade-in">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-500 mb-4"></div>
          <p className="text-gray-600 text-lg">{t("loading")}...</p>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Rides as Driver */}
          <section className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-8 animate-slide-in-up">
            <h2 className="text-2xl font-semibold text-purple-700 mb-6 flex items-center gap-2">
              <FaUserTie className="text-purple-600" /> {t("ridesAsDriver")}
            </h2>

            {rides.asDriver.length === 0 ? (
              <p className="text-gray-500 italic">{t("noRidesAsDriver")}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {rides.asDriver.map((ride) => (
                  <div
                    key={ride.id}
                    className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-teal-800">
                          {ride.pickupLocation} → {ride.dropoffLocation}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(ride.departureTime).toLocaleDateString()} ⏰{" "}
                          {new Date(ride.departureTime).toLocaleTimeString()} -{" "}
                          {new Date(ride.arrivalTime).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-yellow-600">
                          ₹{ride.price}
                        </p>
                        <p className="text-sm text-gray-500">
                          {ride.seatsAvailable} {t("seatsAvailable")}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                      <h4 className="text-lg font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <FaUser className="text-teal-600" /> {t("bookings")} (
                        {ride.bookings?.length || 0})
                      </h4>
                      <div className="space-y-3">
                        {ride.bookings?.map((booking) => (
                          <div
                            key={booking.id}
                            className="flex items-center justify-between py-2 px-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-semibold">
                                {booking.user?.name?.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-800">
                                  {booking.user?.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {booking.user?.phone}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
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
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Rides as Rider */}
          <section className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg p-8 animate-slide-in-up">
            <h2 className="text-2xl font-semibold text-purple-700 mb-6 flex items-center gap-2">
              <FaHourglassHalf className="text-purple-600" />{" "}
              {t("ridesAsRider")}
            </h2>

            {rides.asRider.length === 0 ? (
              <p className="text-gray-500 italic">{t("noRidesAsRider")}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {rides.asRider.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-2xl p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-teal-800">
                          {booking.ride?.pickupLocation} →{" "}
                          {booking.ride?.dropoffLocation}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {new Date(
                            booking.ride?.departureTime
                          ).toLocaleDateString()}{" "}
                          ⏰{" "}
                          {new Date(
                            booking.ride?.departureTime
                          ).toLocaleTimeString()}{" "}
                          -{" "}
                          {new Date(
                            booking.ride?.arrivalTime
                          ).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-yellow-600">
                          ₹{booking.ride?.price}
                        </p>
                        <span
                          className={`text-xs px-3 py-1.5 rounded-full font-semibold ${
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
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold">
                          {booking.ride?.driver?.name?.charAt(0)}
                        </div>
                        <div>
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
                          className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                          <FaCheckCircle /> {t("completeRide")}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default MyRides;
