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
          {/* Rides as Driver */}
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

          {/* Rides as Rider */}
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
