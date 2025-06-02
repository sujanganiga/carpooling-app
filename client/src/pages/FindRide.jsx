/*
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
*/
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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 tracking-tight">
        {t("findRide")}
      </h1>

      <div className="mb-6 bg-gradient-to-r from-blue-50 to-emerald-50 p-4 rounded-lg">
        <h2 className="text-base font-medium text-gray-800 mb-2">
          {t("searchWithAI")}
        </h2>
        <div className="flex space-x-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder={t("aiPlaceholder")}
            className="flex-grow px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
          />
          <button
            onClick={handleAiSearch}
            className="bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
          >
            {t("search")}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("pickupLocation")}
          </label>
          <input
            name="pickup"
            value={filters.pickup}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
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
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
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
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
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
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
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
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
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
            className="w-full bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 disabled:bg-gray-300 disabled:text-gray-600"
          >
            {loading ? t("searching") + "..." : t("searchRides")}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 border border-red-200 animate-fade-in">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-blue-700 mx-auto"></div>
            <p className="text-gray-600 text-sm mt-2">{t("loadingRides")}</p>
          </div>
        ) : rides.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">{t("noRidesFound")}</p>
          </div>
        ) : (
          rides.map((ride) => (
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

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gray-100 border-2 border-dashed rounded-lg w-8 h-8" />
                  <div className="ml-2">
                    <p className="text-sm font-medium text-gray-800">
                      {ride.driver?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {ride.driver?.phone}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => bookRide(ride.id)}
                  className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 text-sm"
                >
                  {t("bookRide")}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

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
              className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-400 text-sm"
            >
              {t("previous")}
            </button>
            <span className="flex items-center px-3 text-sm text-gray-700">
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
              className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:bg-gray-50 disabled:text-gray-400 text-sm"
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
