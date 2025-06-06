import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar,
  FaCar,
  FaUser,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCamera,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaTimes,
} from "react-icons/fa";
import DriftLoading from "../components/DriftLoading";

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    carModel: "",
    carPlate: "",
    licenseNumber: "",
    carColor: "",
    carCapacity: "",
  });
  const [preview, setPreview] = useState("");
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const fileInputRef = useRef(null);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0,0,0,0.1)",
    },
    tap: {
      scale: 0.95,
    },
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        carModel: user.carModel || "",
        carPlate: user.carPlate || "",
        licenseNumber: user.licenseNumber || "",
        carColor: user.carColor || "",
        carCapacity: user.carCapacity || "",
      });
      setPreview(
        user.profilePhoto
          ? `http://localhost:5000${user.profilePhoto}`
          : "/default-profile.png"
      );
    }
  }, [user]);

  const fetchReviews = async () => {
    if (!user?.id) {
      console.log("No user ID available, skipping reviews fetch");
      setIsLoadingReviews(false);
      return;
    }

    try {
      setIsLoadingReviews(true);
      setError("");
      console.log("Fetching reviews for user:", user.id);

      const response = await api.get(`/api/reviews/user/${user.id}`);
      console.log("Reviews response:", response.data);

      if (response.data && Array.isArray(response.data)) {
        setReviews(response.data);
        console.log(`Successfully loaded ${response.data.length} reviews`);
      } else {
        console.error("Invalid reviews data format:", response.data);
        setError(t("errorInvalidReviewsData") || "Invalid reviews data format");
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError(
        error.response?.data?.message ||
          t("errorFetchingReviews") ||
          "Error fetching reviews"
      );
      setReviews([]);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  // Fetch reviews when component mounts and when user changes
  useEffect(() => {
    if (user?.id) {
      fetchReviews();
    }
  }, [user?.id]);

  // Fetch reviews after successful profile update
  useEffect(() => {
    if (success) {
      fetchReviews();
    }
  }, [success]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "carCapacity"
          ? value === ""
            ? ""
            : parseInt(value, 10)
          : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError(t("fileTooLarge") || "File size should be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setError("");
    setSuccess(false);

    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      setError(t("invalidPhoneNumber") || "Invalid phone number.");
      setIsUpdatingProfile(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);

      // Add driver-specific fields if user is a driver
      if (user?.isDriver) {
        formDataToSend.append("carModel", formData.carModel);
        formDataToSend.append("carPlate", formData.carPlate);
        formDataToSend.append("licenseNumber", formData.licenseNumber);
        formDataToSend.append("carColor", formData.carColor);
        formDataToSend.append("carCapacity", formData.carCapacity);
      }

      const selectedFile = fileInputRef.current?.files?.[0];
      if (selectedFile) {
        formDataToSend.append("profilePhoto", selectedFile);
      }

      const response = await api.put("/api/user/profile", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      updateUser(response.data.user);

      if (response.data.user.profilePhoto) {
        setPreview(
          `http://localhost:5000${
            response.data.user.profilePhoto
          }?${Date.now()}`
        );
      }
      fileInputRef.current.value = "";

      setSuccess(true);
      setIsEditMode(false); // Exit edit mode after successful save
      setTimeout(() => setSuccess(false), 3000);

      // Refresh reviews after profile update
      await fetchReviews();
    } catch (err) {
      console.error("Profile update error:", err);
      setError(
        err.response?.data?.message ||
          t("updateFailed") ||
          "Profile update failed."
      );
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        carModel: user.carModel || "",
        carPlate: user.carPlate || "",
        licenseNumber: user.licenseNumber || "",
        carColor: user.carColor || "",
        carCapacity: user.carCapacity || "",
      });
      setPreview(
        user.profilePhoto
          ? `http://localhost:5000${user.profilePhoto}`
          : "/default-profile.png"
      );
    }
    setIsEditMode(false);
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-tr from-purple-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 px-6 lg:px-20"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl p-10"
      >
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            variants={itemVariants}
            className="text-3xl font-extrabold bg-gradient-to-r from-teal-600 to-purple-600 bg-clip-text text-transparent"
          >
            {t("profile")}
          </motion.h1>
          <AnimatePresence mode="wait">
            {!isEditMode ? (
              <motion.button
                key="edit"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleEditClick}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2.5 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <FaEdit className="text-sm" />
                {t("editProfile")}
              </motion.button>
            ) : (
              <motion.button
                key="cancel"
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleCancelEdit}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-2.5 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 flex items-center gap-2 shadow-lg"
              >
                <FaTimes className="text-sm" />
                {t("cancel")}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center mb-6 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800"
            >
              <FaCheckCircle className="text-green-500 text-2xl mr-2 animate-pulse" />
              <span className="text-green-700 dark:text-green-400 font-medium">
                {t("profileUpdatedSuccessfully")}
              </span>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center justify-center mb-6 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800"
            >
              <FaTimesCircle className="text-red-500 text-2xl mr-2" />
              <span className="text-red-600 dark:text-red-400 font-medium">
                {error}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-8">
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center"
          >
            <motion.div
              variants={imageVariants}
              whileHover="hover"
              className="relative group"
            >
              <img
                className="h-32 w-32 object-cover rounded-full border-4 border-white dark:border-gray-700 shadow-lg transition-transform duration-300 group-hover:border-teal-400 dark:group-hover:border-teal-500"
                src={preview}
                alt="Profile"
                onError={() => setPreview("/default-profile.png")}
              />
              {isEditMode && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  onClick={triggerFileInput}
                  className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 shadow-md transition-all duration-300"
                  title={t("changePhoto")}
                >
                  <FaCamera className="text-teal-600 dark:text-teal-400" />
                </motion.button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </motion.div>
            {isEditMode && (
              <motion.p
                variants={itemVariants}
                className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center"
              >
                {t("profilePhotoInstructions")}
                <br />
                {t("maxFileSize")}: 2 MB
              </motion.p>
            )}
          </motion.div>

          <motion.div variants={containerVariants} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants} className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {t("name")}
                </label>
                <input
                  aria-label={t("name")}
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  className={`w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200 ${
                    !isEditMode
                      ? "bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
                      : "bg-white dark:bg-gray-800"
                  }`}
                />
              </motion.div>

              <motion.div variants={itemVariants} className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {t("phone")}
                </label>
                <input
                  aria-label={t("phone")}
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  className={`w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200 ${
                    !isEditMode
                      ? "bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
                      : "bg-white dark:bg-gray-800"
                  }`}
                />
              </motion.div>
            </div>

            <motion.div
              variants={itemVariants}
              className="pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-wrap gap-6">
                <div className="flex-1 min-w-[200px]">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {t("email")}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 break-all">
                    {user?.email}
                  </p>
                </div>

                <div className="flex-1 min-w-[120px]">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    {t("role")}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {user?.isDriver ? t("driver") : t("passenger")}
                  </p>
                </div>

                {user?.rating > 0 && (
                  <div className="flex-1 min-w-[120px]">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {t("rating")}
                    </p>
                    <div className="flex items-center">
                      <FaStar className="text-yellow-500 mr-1" />
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {user.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {user?.isDriver && (
              <motion.div
                variants={itemVariants}
                className="border-t border-gray-200 dark:border-gray-700 pt-6"
              >
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3">
                  {t("driverInfo")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div variants={itemVariants} className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {t("carModel")}
                    </label>
                    <input
                      type="text"
                      name="carModel"
                      value={formData.carModel}
                      onChange={handleChange}
                      disabled={!isEditMode}
                      className={`w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200 ${
                        !isEditMode
                          ? "bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
                          : "bg-white dark:bg-gray-800"
                      }`}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {t("carPlate")}
                    </label>
                    <input
                      type="text"
                      name="carPlate"
                      value={formData.carPlate}
                      onChange={handleChange}
                      disabled={!isEditMode}
                      className={`w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200 ${
                        !isEditMode
                          ? "bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
                          : "bg-white dark:bg-gray-800"
                      }`}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {t("licenseNumber")}
                    </label>
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      disabled={!isEditMode}
                      className={`w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200 ${
                        !isEditMode
                          ? "bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
                          : "bg-white dark:bg-gray-800"
                      }`}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {t("carColor")}
                    </label>
                    <input
                      type="text"
                      name="carColor"
                      value={formData.carColor}
                      onChange={handleChange}
                      disabled={!isEditMode}
                      className={`w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200 ${
                        !isEditMode
                          ? "bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
                          : "bg-white dark:bg-gray-800"
                      }`}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="group">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      {t("carCapacity")}
                    </label>
                    <input
                      type="number"
                      name="carCapacity"
                      min="1"
                      max="10"
                      value={formData.carCapacity}
                      onChange={handleChange}
                      disabled={!isEditMode}
                      className={`w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200 ${
                        !isEditMode
                          ? "bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
                          : "bg-white dark:bg-gray-800"
                      }`}
                    />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {isEditMode && (
              <motion.div
                variants={itemVariants}
                className="flex justify-center"
              >
                <motion.button
                  type="submit"
                  disabled={isUpdatingProfile}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-600 dark:to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingProfile ? (
                    <span className="flex items-center gap-2">
                      <DriftLoading variant="inline" />
                      {t("saving")}...
                    </span>
                  ) : (
                    t("saveChanges")
                  )}
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </form>

        <motion.div
          variants={containerVariants}
          className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl overflow-hidden mt-8"
        >
          <div className="p-6">
            <motion.h2
              variants={itemVariants}
              className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6"
            >
              {t("reviews")} ({reviews.length})
            </motion.h2>

            {isLoadingReviews ? (
              <motion.div variants={itemVariants} className="text-center py-8">
                <DriftLoading variant="inline" />
                <div className="text-gray-600 dark:text-gray-400 mt-2">
                  {t("loadingReviews")}...
                </div>
              </motion.div>
            ) : reviews.length === 0 ? (
              <motion.div variants={itemVariants} className="text-center py-8">
                <div className="bg-gray-200 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl w-16 h-16 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  {t("noReviews")}
                </p>
              </motion.div>
            ) : (
              <motion.div variants={containerVariants} className="space-y-6">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review._id}
                    variants={itemVariants}
                    custom={index}
                    className="border-b border-gray-100 dark:border-gray-700 pb-6 last:border-0 last:pb-0"
                  >
                    <div className="flex justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <motion.img
                          whileHover={{ scale: 1.1 }}
                          src={
                            review.reviewer.profilePhoto
                              ? `http://localhost:5000${review.reviewer.profilePhoto}`
                              : "/default-profile.png"
                          }
                          alt={review.reviewer.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/default-profile.png";
                          }}
                        />
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-gray-200">
                            {review.reviewer.name}
                          </h4>
                          <div className="flex items-center text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={
                                  i < review.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300 dark:text-gray-600"
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl"
                    >
                      {review.comment ? (
                        <p className="text-gray-700 dark:text-gray-300">
                          {review.comment}
                        </p>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 italic">
                          {t("noComment")}
                        </p>
                      )}
                    </motion.div>

                    {review.ride && (
                      <motion.div
                        variants={itemVariants}
                        className="mt-4 text-sm text-gray-600 dark:text-gray-400"
                      >
                        <p className="flex items-center">
                          <FaMapMarkerAlt className="mr-2 text-indigo-500 dark:text-indigo-400" />
                          {review.ride.pickupLocation} →{" "}
                          {review.ride.dropoffLocation}
                        </p>
                        <p className="flex items-center">
                          <FaCalendarAlt className="mr-2 text-indigo-500 dark:text-indigo-400" />
                          {new Date(
                            review.ride.departureTime
                          ).toLocaleDateString()}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
