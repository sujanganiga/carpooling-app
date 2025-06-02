import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../utils/api";
import { parsePromptToFilter } from "../utils/aiPromptFilter";

const FindRide = () => {
  const { t } = useTranslation();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    pickup: "",
    dropoff: "",
    date: "",
    maxPrice: "",
    minSeats: "",
  });
  const [aiPrompt, setAiPrompt] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleAiSearch = () => {
    if (!aiPrompt.trim()) return;
    const aiFilters = parsePromptToFilter(aiPrompt);
    setFilters(aiFilters);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to page 1
  };

  const searchRides = async () => {
    setLoading(true);
    setError("");
    try {
      const params = {
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "")
        ),
        page: pagination.page,
        limit: 10,
      };
      const response = await api.get("/rides", { params });
      if (Array.isArray(response.data)) {
        setRides(response.data);
        setPagination({ total: response.data.length, page: 1, totalPages: 1 });
      } else {
        setRides(response.data.rides);
        setPagination({
          total: response.data.total,
          page: response.data.page,
          totalPages: response.data.totalPages,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || t("searchFailed"));
    } finally {
      setLoading(false);
    }
  };

  const bookRide = async (rideId) => {
    if (window.confirm(t("confirmBooking"))) {
      try {
        await api.post(`/rides/${rideId}/book`);
        alert(t("rideBookedSuccessfully"));
        searchRides(); // Refresh after booking
      } catch (err) {
        alert(err.response?.data?.message || t("bookingFailed"));
      }
    }
  };

  useEffect(() => {
    searchRides();
  }, [pagination.page]); // Fetch rides on page change

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("findRide")}</h1>

      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-medium text-gray-900 mb-3">
          {t("searchWithAI")}
        </h2>
        <div className="flex space-x-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder={t("aiPlaceholder")}
            className="input-field flex-grow"
          />
          <button
            onClick={handleAiSearch}
            className="btn-primary whitespace-nowrap"
          >
            {t("search")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* All filter inputs (same as before) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("pickupLocation")}
          </label>
          <input
            name="pickup"
            value={filters.pickup}
            onChange={handleFilterChange}
            className="input-field"
            placeholder={t("enterPickupLocation")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("dropoffLocation")}
          </label>
          <input
            name="dropoff"
            value={filters.dropoff}
            onChange={handleFilterChange}
            className="input-field"
            placeholder={t("enterDropoffLocation")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("departureDate")}
          </label>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("maxPrice")}
          </label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            className="input-field"
            placeholder={t("enterMaxPrice")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("minSeats")}
          </label>
          <input
            type="number"
            name="minSeats"
            value={filters.minSeats}
            onChange={handleFilterChange}
            className="input-field"
            placeholder={t("enterMinSeats")}
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={() => {
              setPagination((prev) => ({ ...prev, page: 1 }));
              searchRides();
            }}
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? t("searching") + "..." : t("searchRides")}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Rides List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <p>{t("loadingRides")}</p>
          </div>
        ) : rides.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">{t("noRidesFound")}</p>
          </div>
        ) : (
          rides.map((ride) => (
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

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {ride.driver?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {ride.driver?.phone}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => bookRide(ride.id)}
                  className="btn-primary"
                >
                  {t("bookRide")}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.max(1, prev.page - 1),
                }))
              }
              disabled={pagination.page === 1}
              className="btn-secondary"
            >
              {t("previous")}
            </button>
            <span className="flex items-center px-4">
              {t("page")} {pagination.page} {t("of")} {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.min(pagination.totalPages, prev.page + 1),
                }))
              }
              disabled={pagination.page === pagination.totalPages}
              className="btn-secondary"
            >
              {t("next")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindRide;
