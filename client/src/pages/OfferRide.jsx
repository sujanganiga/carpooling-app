import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
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

const MapComponent = ({ position, setPosition, setLocationName }) => {
  const map = useMap();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (position) {
      map.setView(position, 13);
      // Reverse geocode to get location name with language support
      fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&accept-language=${i18n.language}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.display_name) {
            setLocationName(data.display_name);
          }
        })
        .catch((err) => console.error("Error getting location name:", err));
    }
  }, [position, map, setLocationName, i18n.language]);

  useEffect(() => {
    const handleMapClick = (e) => {
      const newPos = e.latlng;
      setPosition(newPos);
    };

    map.on("click", handleMapClick);

    return () => {
      map.off("click", handleMapClick);
    };
  }, [map, setPosition]);

  return position ? (
    <Marker
      position={position}
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const newPos = e.target.getLatLng();
          setPosition(newPos);
        },
      }}
    />
  ) : null;
};

const SearchBar = ({ onSearch, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeout = useRef(null);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      if (value.trim()) {
        onSearch(value);
      }
    }, 500);
  };

  return (
    <div className="relative mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
      />
    </div>
  );
};

const OfferRide = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [pickupPosition, setPickupPosition] = useState(null);
  const [dropoffPosition, setDropoffPosition] = useState(null);
  const [distance, setDistance] = useState(null);
  const [pickupLocationName, setPickupLocationName] = useState("");
  const [dropoffLocationName, setDropoffLocationName] = useState("");
  const [suggestedPrice, setSuggestedPrice] = useState(null);
  const [priceWarning, setPriceWarning] = useState("");

  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    seatsAvailable: "",
  });

  const handleSearch = async (searchTerm, isPickup = true) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchTerm
        )}&accept-language=${i18n.language}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const location = data[0];
        const newPosition = {
          lat: parseFloat(location.lat),
          lng: parseFloat(location.lon),
        };

        if (isPickup) {
          setPickupPosition(newPosition);
          setPickupLocationName(location.display_name);
          setFormData((prev) => ({
            ...prev,
            pickupLocation: location.display_name,
          }));
        } else {
          setDropoffPosition(newPosition);
          setDropoffLocationName(location.display_name);
          setFormData((prev) => ({
            ...prev,
            dropoffLocation: location.display_name,
          }));
        }
      }
    } catch (error) {
      console.error("Error searching location:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateDistance = () => {
    if (pickupPosition && dropoffPosition) {
      const R = 6371; // Earth's radius in km
      const dLat = ((dropoffPosition.lat - pickupPosition.lat) * Math.PI) / 180;
      const dLon = ((dropoffPosition.lng - pickupPosition.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((pickupPosition.lat * Math.PI) / 180) *
          Math.cos((dropoffPosition.lat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;
      setDistance(distance.toFixed(1));
    }
  };

  const calculateSuggestedPrice = (distance) => {
    // Base price per km (adjusted for Indian market)
    const basePricePerKm = 15; // ₹15 per km
    const minPrice = 50; // Minimum price ₹50 for any ride
    const maxPricePerKm = 30; // Maximum ₹30 per km

    let suggested = distance * basePricePerKm;
    suggested = Math.max(suggested, minPrice); // Ensure minimum price
    return Math.round(suggested); // Round to whole rupees
  };

  const checkPriceWarning = (price, distance) => {
    const maxPricePerKm = 30; // Maximum reasonable price per km
    const maxPrice = distance * maxPricePerKm;

    if (price > maxPrice) {
      return `Warning: This price (₹${price}) is higher than the recommended maximum (₹${maxPrice}). Passengers might be less likely to book at this rate.`;
    }
    return "";
  };

  useEffect(() => {
    calculateDistance();
  }, [pickupPosition, dropoffPosition]);

  useEffect(() => {
    if (distance) {
      const suggested = calculateSuggestedPrice(distance);
      setSuggestedPrice(suggested);
    }
  }, [distance]);

  useEffect(() => {
    if (formData.price && distance) {
      const warning = checkPriceWarning(parseFloat(formData.price), distance);
      setPriceWarning(warning);
    } else {
      setPriceWarning("");
    }
  }, [formData.price, distance]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validate required fields
    if (!pickupPosition || !dropoffPosition) {
      setError("Please select both pickup and dropoff locations on the map");
      setLoading(false);
      return;
    }

    if (!formData.departureTime || !formData.arrivalTime) {
      setError("Please select both departure and arrival times");
      setLoading(false);
      return;
    }

    if (!formData.price || !formData.seatsAvailable) {
      setError("Please enter both price and number of seats");
      setLoading(false);
      return;
    }

    try {
      const rideData = {
        pickupLocation: pickupLocationName,
        dropoffLocation: dropoffLocationName,
        departureTime: new Date(formData.departureTime).toISOString(),
        arrivalTime: new Date(formData.arrivalTime).toISOString(),
        price: parseFloat(formData.price),
        seatsAvailable: parseInt(formData.seatsAvailable),
        distance: parseFloat(distance),
        pickupLat: pickupPosition.lat,
        pickupLng: pickupPosition.lng,
        dropoffLat: dropoffPosition.lat,
        dropoffLng: dropoffPosition.lng,
      };

      console.log("Submitting ride data:", rideData);

      const response = await api.post("/api/rides", rideData);
      console.log("Server response:", response.data);

      setSuccess(true);
      setFormData({
        pickupLocation: "",
        dropoffLocation: "",
        departureTime: "",
        arrivalTime: "",
        price: "",
        seatsAvailable: "",
      });
      setPickupPosition(null);
      setDropoffPosition(null);
      setDistance(null);
      setCurrentStep(1);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error submitting ride:", err);
      setError(err.response?.data?.message || t("offerFailed"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <DriftLoading />;
  }

  if (!user?.isDriver) {
    return (
      <div className="bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-xl shadow-2xl p-10 animate-fade-in">
        <h1 className="text-4xl font-bold text-teal-700 dark:text-teal-400 mb-6 text-center">
          {t("offerRide")}
        </h1>
        <div className="text-center py-6">
          <p className="text-red-600 dark:text-red-400 text-lg font-semibold mb-3">
            {t("driverModeRequired")}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-5 italic">
            {t("switchToDriverModeMessage")}
          </p>
          <Link
            to="/profile"
            className="bg-gradient-to-r from-purple-500 to-teal-500 dark:from-purple-600 dark:to-teal-600 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300"
          >
            {t("goToProfile")}
          </Link>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-teal-700 dark:text-teal-400 mb-4">
              {t("pickupLocation")}
            </h2>
            <SearchBar
              onSearch={(term) => handleSearch(term, true)}
              placeholder={t("searchPickupLocation")}
            />
            <div className="relative">
              <div className="absolute top-4 left-4 z-[1000] bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t("clickOnMapToSelect")}
                </p>
              </div>
              <div className="h-[400px] rounded-lg overflow-hidden shadow-lg">
                <MapContainer
                  center={[12.9716, 77.5946]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MapComponent
                    position={pickupPosition}
                    setPosition={setPickupPosition}
                    setLocationName={setPickupLocationName}
                  />
                </MapContainer>
              </div>
            </div>
            {pickupLocationName && (
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                <p className="text-green-700 dark:text-green-300">
                  {t("selectedLocation")}: {pickupLocationName}
                </p>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-teal-700 dark:text-teal-400 mb-4">
              {t("dropoffLocation")}
            </h2>
            <SearchBar
              onSearch={(term) => handleSearch(term, false)}
              placeholder={t("searchDropoffLocation")}
            />
            <div className="relative">
              <div className="absolute top-4 left-4 z-[1000] bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t("clickOnMapToSelect")}
                </p>
              </div>
              <div className="h-[400px] rounded-lg overflow-hidden shadow-lg">
                <MapContainer
                  center={[12.9716, 77.5946]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MapComponent
                    position={dropoffPosition}
                    setPosition={setDropoffPosition}
                    setLocationName={setDropoffLocationName}
                  />
                </MapContainer>
              </div>
            </div>
            {dropoffLocationName && (
              <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
                <p className="text-green-700 dark:text-green-300">
                  {t("selectedLocation")}: {dropoffLocationName}
                </p>
              </div>
            )}
            {distance && (
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <p className="text-blue-700 dark:text-blue-300">
                  {t("estimatedDistance")}: {distance} km
                </p>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-teal-700 dark:text-teal-400 mb-4">
              {t("schedule")}
            </h2>
            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {t("departureTime")}
                </label>
                <input
                  type="datetime-local"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {t("arrivalTime")}
                </label>
                <input
                  type="datetime-local"
                  name="arrivalTime"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-teal-700 dark:text-teal-400 mb-4">
              {t("rideDetails")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {t("pricePerSeat")} (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder={t("enterPricePerSeat")}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
                {priceWarning && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {priceWarning}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  {t("totalSeats")}
                </label>
                <input
                  type="number"
                  name="seatsAvailable"
                  value={formData.seatsAvailable}
                  onChange={handleChange}
                  placeholder={t("enterTotalSeats")}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
            </div>
            {distance && (
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <p className="text-blue-700 dark:text-blue-300">
                  {t("estimatedDistance")}: {distance} km
                </p>
                <p className="text-blue-700 dark:text-blue-300 mt-2">
                  Estimated total earnings: ₹
                  {(
                    parseFloat(formData.price || 0) *
                    parseInt(formData.seatsAvailable || 0)
                  ).toFixed(0)}
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-10 animate-fade-in">
      <h1 className="text-4xl font-extrabold text-teal-700 dark:text-teal-400 mb-8 text-center">
        {t("offerRide")}
      </h1>

      {success && (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-4 rounded-lg mb-6 border border-green-300 dark:border-green-700 animate-fade-in">
          {t("rideOfferedSuccessfully")}
        </div>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-4 rounded-lg mb-6 border border-red-300 dark:border-red-700 animate-fade-in">
          {error}
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex-1 h-2 mx-2 rounded-full ${
                step <= currentStep
                  ? "bg-teal-500 dark:bg-teal-400"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStep()}

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="bg-gray-500 dark:bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
            >
              {t("previous")}
            </button>
          )}
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="bg-teal-500 dark:bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-600 dark:hover:bg-teal-700 transition-colors ml-auto"
            >
              {t("next")}
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-teal-500 dark:from-purple-600 dark:to-teal-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300 disabled:bg-gray-400 dark:disabled:bg-gray-600 ml-auto"
            >
              {loading ? t("offeringRide") + "..." : t("offerRideBtn")}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default OfferRide;
