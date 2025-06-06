import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import api from "../utils/api";
import { parsePromptToFilter } from "../utils/aiPromptFilter";
import { FaStar, FaPhone, FaCheckCircle, FaMapMarkerAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import DriftLoading from "../components/DriftLoading";

// Fix for default marker icons in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 0C5.383 0 0 5.383 0 12C0 18.617 12 36 12 36C12 36 24 18.617 24 12C24 5.383 18.617 0 12 0Z" fill="${color}"/>
        <circle cx="12" cy="12" r="4" fill="white"/>
      </svg>
    `,
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36],
  });
};

const pickupIcon = createCustomIcon("#4CAF50"); // Green for pickup
const dropoffIcon = createCustomIcon("#F44336"); // Red for dropoff

const RideMap = ({ pickup, dropoff }) => {
  // Validate coordinates
  const isValidCoordinate = (lat, lng) => {
    return (
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  };

  // Default to a central location if coordinates are invalid
  const defaultCenter = [20.5937, 78.9629]; // Center of India

  // Calculate center point only if both coordinates are valid
  const center =
    isValidCoordinate(pickup.lat, pickup.lng) &&
    isValidCoordinate(dropoff.lat, dropoff.lng)
      ? [(pickup.lat + dropoff.lat) / 2, (pickup.lng + dropoff.lng) / 2]
      : defaultCenter;

  return (
    <div className="h-[300px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={center}
        zoom={12}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {isValidCoordinate(pickup.lat, pickup.lng) && (
          <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon}>
            <Popup>
              <div className="text-sm">
                <strong className="text-green-600">Pickup Location:</strong>
                <p>{pickup.address}</p>
              </div>
            </Popup>
          </Marker>
        )}
        {isValidCoordinate(dropoff.lat, dropoff.lng) && (
          <Marker position={[dropoff.lat, dropoff.lng]} icon={dropoffIcon}>
            <Popup>
              <div className="text-sm">
                <strong className="text-red-600">Dropoff Location:</strong>
                <p>{dropoff.address}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      <div className="mt-2 flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <svg
            width="16"
            height="24"
            viewBox="0 0 24 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 0C5.383 0 0 5.383 0 12C0 18.617 12 36 12 36C12 36 24 18.617 24 12C24 5.383 18.617 0 12 0Z"
              fill="#4CAF50"
            />
            <circle cx="12" cy="12" r="4" fill="white" />
          </svg>
          <span>Pickup</span>
        </div>
        <div className="flex items-center gap-2">
          <svg
            width="16"
            height="24"
            viewBox="0 0 24 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 0C5.383 0 0 5.383 0 12C0 18.617 12 36 12 36C12 36 24 18.617 24 12C24 5.383 18.617 0 12 0Z"
              fill="#F44336"
            />
            <circle cx="12" cy="12" r="4" fill="white" />
          </svg>
          <span>Dropoff</span>
        </div>
      </div>
    </div>
  );
};

const FindRide = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [myBookings, setMyBookings] = useState([]);
  const [filters, setFilters] = useState({
    pickup: "",
    dropoff: "",
    date: "",
    maxPrice: "",
    minSeats: "",
  });
  const [sortBy, setSortBy] = useState("departureTime");
  const [sortOrder, setSortOrder] = useState("asc");
  const [aiPrompt, setAiPrompt] = useState("");
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
  });
  const [selectedRide, setSelectedRide] = useState(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleAiSearch = () => {
    if (!aiPrompt.trim()) return;
    try {
      console.log("AI Prompt:", aiPrompt);
      const aiFilters = parsePromptToFilter(aiPrompt);
      console.log("Parsed Filters:", aiFilters);

      // Set filters and trigger search
      setFilters(aiFilters);
      setPagination((prev) => ({ ...prev, page: 1 }));

      // Use setTimeout to ensure state updates are complete
      setTimeout(() => {
        searchRides();
      }, 0);
    } catch (error) {
      console.error("Error in AI search:", error);
      setError(t("aiSearchFailed"));
    }
  };

  const fetchMyBookings = async () => {
    try {
      const response = await api.get("/api/rides/my-rides");
      const bookings = response.data.asPassenger || [];
      setMyBookings(bookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyBookings();
    }
  }, [user]);

  const searchRides = async () => {
    setLoading(true);
    setError("");
    try {
      console.log("Current Filters:", filters);
      const params = {
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== "")
        ),
        page: pagination.page,
        limit: 10,
        sortBy,
        sortOrder,
      };
      console.log("Search Params:", params);

      const response = await api.get("/api/rides", { params });
      console.log("Search Response:", response.data);

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
      console.error("Search error:", err);
      setError(err.response?.data?.message || t("searchFailed"));
    } finally {
      setLoading(false);
    }
  };

  const bookRide = async (rideId) => {
    if (window.confirm(t("confirmBooking"))) {
      try {
        await api.post(`/api/rides/${rideId}/book`);
        alert(t("rideBookedSuccessfully"));
        searchRides();
        fetchMyBookings(); // Refresh bookings after booking
      } catch (err) {
        alert(err.response?.data?.message || t("bookingFailed"));
      }
    }
  };

  const getMyBookingForRide = (rideId) => {
    return myBookings.find((booking) => booking.rideId === rideId);
  };

  // Add useEffect to trigger search when pagination changes
  useEffect(() => {
    searchRides();
  }, [pagination.page]);

  // Add useEffect to trigger initial search
  useEffect(() => {
    searchRides();
  }, []);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    searchRides();
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 bg-gradient-to-tr from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl shadow-2xl border border-blue-200 dark:border-gray-700">
      <h1 className="text-4xl font-extrabold text-center text-blue-800 dark:text-blue-400 mb-10 animate-pulse">
        {t("findRide")}
      </h1>

      {/* AI Search */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border border-blue-100 dark:border-gray-600 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            {t("searchWithAI")}
          </h2>
          <button
            onClick={() => setAiPrompt("")}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            title={t("clearSearch")}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="relative">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder={t("aiPlaceholder")}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:outline-none transition-all duration-200"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
            <button
              onClick={handleAiSearch}
              disabled={!aiPrompt.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white font-semibold hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {t("search")}
            </button>
          </div>

          {/* Example Prompts */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {t("tryTheseExamples")}:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Find rides from Delhi to Mumbai tomorrow morning",
                "Show me rides to Bangalore under ₹1000",
                "Need a ride from Chennai to Hyderabad with 2 seats",
                "Looking for rides to Pune this weekend",
              ].map((example, index) => (
                <button
                  key={index}
                  onClick={() => setAiPrompt(example)}
                  className="text-sm px-3 py-1.5 bg-white/50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 border border-blue-200 dark:border-gray-600 rounded-full text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all duration-200"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Search Tips */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-gray-700/50 rounded-lg border border-blue-100 dark:border-gray-600">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-1">
                  {t("searchTips")}
                </p>
                <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside">
                  <li>{t("tipLocation")}</li>
                  <li>{t("tipTime")}</li>
                  <li>{t("tipPrice")}</li>
                  <li>{t("tipSeats")}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Manual Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
          <svg
            className="w-6 h-6 text-blue-600 dark:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          {t("filtersAndSort")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {[
            {
              name: "pickup",
              placeholder: t("enterPickupLocation"),
              icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
            },
            {
              name: "dropoff",
              placeholder: t("enterDropoffLocation"),
              icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
            },
            {
              name: "date",
              type: "date",
              icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
            },
            {
              name: "maxPrice",
              type: "number",
              placeholder: t("enterMaxPrice"),
              icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
            },
            {
              name: "minSeats",
              type: "number",
              placeholder: t("enterMinSeats"),
              icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
            },
          ].map(({ name, type = "text", placeholder = "", icon }) => (
            <div key={name} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={icon}
                  />
                </svg>
              </div>
              <input
                type={type}
                name={name}
                value={filters[name]}
                onChange={handleFilterChange}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 focus:outline-none transition-all duration-200"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                  />
                </svg>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-10 pr-8 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 focus:outline-none appearance-none"
              >
                <option value="departureTime">
                  {t("sortByDepartureTime")}
                </option>
                <option value="price">{t("sortByPrice")}</option>
                <option value="distance">{t("sortByDistance")}</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </div>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="pl-10 pr-8 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500 focus:outline-none appearance-none"
              >
                <option value="asc">{t("ascending")}</option>
                <option value="desc">{t("descending")}</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 dark:hover:from-blue-600 dark:hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {t("searching")}...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                {t("searchRides")}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6 border border-red-300 dark:border-red-700">
          {error}
        </div>
      )}

      {/* Ride Cards */}
      <div className="space-y-6">
        {loading ? (
          <DriftLoading variant="inline" />
        ) : rides.length === 0 ? (
          <div className="text-center py-10 text-gray-600 dark:text-gray-400 text-lg italic">
            {t("noRidesFound")}
          </div>
        ) : (
          rides.map((ride) => {
            const myBooking = getMyBookingForRide(ride.id);
            return (
              <div
                key={ride.id}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-xl font-bold">
                      <span className="text-green-700 dark:text-green-400">
                        {ride.pickupLocation}
                      </span>
                      <span className="text-blue-700 dark:text-blue-400">
                        {" "}
                        →{" "}
                      </span>
                      <span className="text-red-700 dark:text-red-400">
                        {ride.dropoffLocation}
                      </span>
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(ride.departureTime).toLocaleString()} →{" "}
                      {new Date(ride.arrivalTime).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                      ₹{ride.price}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {ride.seatsAvailable} {t("seatsAvailable")}
                    </p>
                  </div>
                </div>

                {/* Map View Button */}
                <button
                  onClick={() =>
                    setSelectedRide(selectedRide?.id === ride.id ? null : ride)
                  }
                  className="mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  <FaMapMarkerAlt />
                  {selectedRide?.id === ride.id ? t("hideMap") : t("viewOnMap")}
                </button>

                {/* Map View */}
                {selectedRide?.id === ride.id && (
                  <div className="mb-4">
                    <RideMap
                      pickup={{
                        lat: parseFloat(ride.pickupLat),
                        lng: parseFloat(ride.pickupLng),
                        address: ride.pickupLocation,
                      }}
                      dropoff={{
                        lat: parseFloat(ride.dropoffLat),
                        lng: parseFloat(ride.dropoffLng),
                        address: ride.dropoffLocation,
                      }}
                    />
                  </div>
                )}

                <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={
                            ride.driver?.profilePhoto
                              ? `${process.env.REACT_APP_API_URL}${ride.driver.profilePhoto}`
                              : "/default-profile.png"
                          }
                          alt={ride.driver?.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-blue-300 dark:border-blue-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/default-profile.png";
                          }}
                        />
                        {ride.driver?.isDriver && (
                          <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full border-2 border-white dark:border-gray-800">
                            {t("driver")}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-800 dark:text-gray-200 text-lg">
                            {ride.driver?.name}
                          </p>
                          {ride.driver?.rating > 0 && (
                            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/50 px-2 py-1 rounded-full">
                              <FaStar className="text-yellow-500" />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {ride.driver.rating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <FaPhone className="text-gray-400 dark:text-gray-500" />
                          {ride.driver?.phone}
                        </p>
                      </div>
                    </div>
                    {myBooking ? (
                      myBooking.status === "rejected" ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold">
                          {t("rejected") || "Rejected"}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg">
                          <FaCheckCircle className="text-red-600 dark:text-red-400" />
                          {t("bookedByYou")}
                        </div>
                      )
                    ) : user?.isDriver ? (
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold">
                        {t("switchToPassengerMode")}
                      </div>
                    ) : (
                      <button
                        onClick={() => bookRide(ride.id)}
                        className="px-6 py-2.5 bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        {t("bookRide")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
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
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("previous")}
          </button>
          <span className="text-gray-600 dark:text-gray-400 font-medium">
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
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("next")}
          </button>
        </div>
      )}
    </div>
  );
};

export default FindRide;
