import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const Register = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name || !formData.email || !formData.password) {
      setError(t("allFieldsRequired"));
      setLoading(false);
      return;
    }

    try {
      const result = await register(formData);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.message || t("registrationFailed"));
      }
    } catch (err) {
      setError(t("registrationFailed"));
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${
        isDarkMode
          ? "bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-tr from-purple-50 via-white to-teal-50"
      }`}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={`w-full max-w-md ${
          isDarkMode
            ? "bg-gray-800/80 text-gray-100 border-gray-700"
            : "bg-white/80 text-gray-900 border-gray-200"
        } backdrop-blur-lg border rounded-3xl shadow-2xl p-8`}
      >
        <motion.h2
          variants={itemVariants}
          className="text-center text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent mb-6"
        >
          {t("createNewAccount")}
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className={`text-center text-sm mb-8 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {t("or")}{" "}
          <Link
            to="/login"
            className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors"
          >
            {t("signinToAccount")}
          </Link>
        </motion.p>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-center mb-6 p-4 rounded-lg border ${
                isDarkMode
                  ? "bg-red-900/50 text-red-300 border-red-700"
                  : "bg-red-100 text-red-700 border-red-300"
              }`}
            >
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form
          variants={itemVariants}
          className="space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            {["name", "email", "password", "phone"].map((field) => (
              <motion.div
                key={field}
                variants={itemVariants}
                className="group relative"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <label
                  htmlFor={field}
                  className={`absolute left-4 transition-all duration-200 ${
                    focusedField === field || formData[field]
                      ? `-top-2 text-xs ${
                          isDarkMode
                            ? "text-purple-400 bg-gray-800"
                            : "text-purple-600 bg-white"
                        } px-2 z-10`
                      : `top-3 ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        }`
                  }`}
                >
                  {t(field)}
                </label>
                <div className="relative">
                  <input
                    id={field}
                    name={field}
                    type={
                      field === "password"
                        ? showPassword
                          ? "text"
                          : "password"
                        : field === "email"
                        ? "email"
                        : field === "phone"
                        ? "tel"
                        : "text"
                    }
                    autoComplete={field === "password" ? "new-password" : "off"}
                    required={field !== "phone"}
                    value={formData[field]}
                    onChange={handleChange}
                    onFocus={() => setFocusedField(field)}
                    onBlur={() => setFocusedField(null)}
                    placeholder={t(field)} // Add visible placeholder
                    className={`w-full px-4 py-3 ${
                      isDarkMode
                        ? "border-gray-600 bg-gray-700 text-gray-100"
                        : "border-gray-300 bg-white text-gray-900"
                    } border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200`}
                  />
                  {field === "password" && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-500 to-teal-500 dark:from-purple-600 dark:to-teal-600 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mx-auto"
                />
              ) : (
                t("signup")
              )}
            </motion.button>
          </motion.div>
        </motion.form>

        <motion.div
          variants={itemVariants}
          className={`text-center text-sm mt-6 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          <p>
            {t("byRegistering")}, you agree to our{" "}
            <Link
              to="/terms"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
