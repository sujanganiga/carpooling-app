import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const Profile = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await api.put("/user/profile", formData);
      updateUser(response.data.user);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || t("updateFailed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("profile")}</h1>

      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-md mb-4">
          {t("profileUpdatedSuccessfully")}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("name")}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="input-field"
            disabled
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {t("phone")}
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? t("saving") + "..." : t("saveChanges")}
          </button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          {t("accountSettings")}
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-700">
              {user?.isDriver ? t("driverModeEnabled") : t("riderModeEnabled")}
            </p>
            <p className="text-sm text-gray-500">
              {t("switchModeDescription")}
            </p>
          </div>
          <button
            className="btn-secondary"
            onClick={async () => {
              try {
                const response = await api.put("/user/role", {
                  isDriver: !user?.isDriver,
                });
                updateUser(response.data.user);
              } catch (err) {
                console.error("Error toggling role:", err);
              }
            }}
          >
            {user?.isDriver ? t("switchToRiderMode") : t("switchToDriverMode")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
