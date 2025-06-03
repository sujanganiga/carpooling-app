import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { FaCamera, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
      });
      setPreview(
        user.profilePhoto
          ? `http://localhost:5000${user.profilePhoto}`
          : "/default-profile.png"
      );
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    setLoading(true);
    setError("");
    setSuccess(false);

    const phoneRegex = /^[6-9]\d{9}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      setError(t("invalidPhoneNumber") || "Invalid phone number.");
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phone", formData.phone);

      const selectedFile = fileInputRef.current?.files?.[0];
      if (selectedFile) {
        formDataToSend.append("profilePhoto", selectedFile);
      }

      const response = await api.put("/user/profile", formDataToSend, {
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
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Profile update error:", err);
      setError(
        err.response?.data?.message ||
          t("updateFailed") ||
          "Profile update failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-50 via-white to-teal-50 py-10 px-6 lg:px-20">
      <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-md border border-gray-200 rounded-3xl shadow-2xl p-10 animate-slide-in-up">
        <h1 className="text-3xl font-extrabold text-center text-teal-700 mb-8">
          {t("profile")}
        </h1>

        {success && (
          <div className="flex items-center justify-center mb-6">
            <FaCheckCircle className="text-green-500 text-2xl mr-2 animate-pulse" />
            <span className="text-green-700 font-medium">
              {t("profileUpdatedSuccessfully")}
            </span>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center mb-6">
            <FaTimesCircle className="text-red-500 text-2xl mr-2" />
            <span className="text-red-600 font-medium">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                className="h-32 w-32 object-cover rounded-full border-4 border-white shadow-lg"
                src={preview}
                alt="Profile"
                onError={() => setPreview("/default-profile.png")}
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 border border-gray-300 hover:bg-gray-100 shadow-md transition-transform transform hover:scale-110"
                title={t("changePhoto")}
              >
                <FaCamera className="text-gray-600" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <p className="mt-4 text-sm text-gray-600 text-center">
              {t("profilePhotoInstructions")}
              <br />
              {t("maxFileSize")}: 2 MB
            </p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-teal-600 transition-colors">
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2 group-hover:text-teal-600 transition-colors">
                  {t("phone")}
                </label>
                <input
                  aria-label={t("phone")}
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    {t("saving")}...
                  </span>
                ) : (
                  t("saveChanges")
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
