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
    setPagination((prev) => ({ ...prev, page: 1 }));
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
        searchRides();
      } catch (err) {
        alert(err.response?.data?.message || t("bookingFailed"));
      }
    }
  };

  useEffect(() => {
    searchRides();
  }, [pagination.page]);

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 bg-gradient-to-tr from-white to-blue-50 rounded-3xl shadow-2xl border border-blue-200">
      <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-10 animate-pulse">
        {t("findRide")}
      </h1>

      {/* AI Search */}
      <div className="mb-8 p-6 bg-white border border-blue-100 rounded-xl shadow-sm">
        <h2 className="text-2xl font-semibold text-blue-700 mb-3">
          {t("searchWithAI")}
        </h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder={t("aiPlaceholder")}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <button
            onClick={handleAiSearch}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-md"
          >
            {t("search")}
          </button>
        </div>
      </div>

      {/* Manual Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[
          { name: "pickup", placeholder: t("enterPickupLocation") },
          { name: "dropoff", placeholder: t("enterDropoffLocation") },
          { name: "date", type: "date" },
          { name: "maxPrice", type: "number", placeholder: t("enterMaxPrice") },
          { name: "minSeats", type: "number", placeholder: t("enterMinSeats") },
        ].map(({ name, type = "text", placeholder = "" }) => (
          <input
            key={name}
            type={type}
            name={name}
            value={filters[name]}
            onChange={handleFilterChange}
            placeholder={placeholder}
            className="px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
        ))}
        <button
          onClick={() => {
            setPagination((prev) => ({ ...prev, page: 1 }));
            searchRides();
          }}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 shadow-md"
        >
          {loading ? t("searching") + "..." : t("searchRides")}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 border border-red-300">
          {error}
        </div>
      )}

      {/* Ride Cards */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center text-gray-500 py-12 text-xl font-medium animate-pulse">
            {t("loadingRides")}
          </div>
        ) : rides.length === 0 ? (
          <div className="text-center py-10 text-gray-600 text-lg italic">
            {t("noRidesFound")}
          </div>
        ) : (
          rides.map((ride) => (
            <div
              key={ride.id}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold text-blue-700">
                    {ride.pickupLocation} → {ride.dropoffLocation}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {new Date(ride.departureTime).toLocaleString()} →{" "}
                    {new Date(ride.arrivalTime).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">
                    ₹{ride.price}
                  </p>
                  <p className="text-sm text-gray-500">
                    {ride.seatsAvailable} {t("seatsAvailable")}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center text-blue-600 font-bold">
                    {ride.driver?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {ride.driver?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {ride.driver?.phone}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => bookRide(ride.id)}
                  className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold shadow-md"
                >
                  {t("bookRide")}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-10 flex justify-center items-center gap-4">
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                page: Math.max(1, prev.page - 1),
              }))
            }
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md font-semibold"
          >
            {t("previous")}
          </button>
          <span className="text-gray-600 font-medium">
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
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md font-semibold"
          >
            {t("next")}
          </button>
        </div>
      )}
    </div>
  );
};

export default FindRide;
