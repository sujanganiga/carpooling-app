import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate("/");
      } else {
        setError(result.message || t("loginFailed"));
      }
    } catch {
      setError(t("loginFailed"));
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
    <div className="min-h-screen bg-gradient-to-tr from-purple-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl p-8"
      >
        <motion.h2
          variants={itemVariants}
          className="text-center text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent mb-6"
        >
          {t("signinToAccount")}
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-center text-sm text-gray-600 dark:text-gray-400 mb-8"
        >
          {t("or")}{" "}
          <Link
            to="/register"
            className="font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300 transition-colors"
          >
            {t("createNewAccount")}
          </Link>
        </motion.p>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center mb-6 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 p-4 rounded-lg border border-red-300 dark:border-red-700"
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
            <motion.div
              variants={itemVariants}
              className="group relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label
                htmlFor="email"
                className={`absolute left-4 transition-all duration-200 ${
                  focusedField === "email" || formData.email
                    ? "-top-2 text-xs text-purple-600 dark:text-purple-400 bg-white dark:bg-gray-800 px-2"
                    : "top-3 text-gray-500 dark:text-gray-400"
                }`}
              >
                {t("email")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-transparent"
              />
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="group relative"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <label
                htmlFor="password"
                className={`absolute left-4 transition-all duration-200 ${
                  focusedField === "password" || formData.password
                    ? "-top-2 text-xs text-purple-600 dark:text-purple-400 bg-white dark:bg-gray-800 px-2"
                    : "top-3 text-gray-500 dark:text-gray-400"
                }`}
              >
                {t("password")}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-transparent"
              />
            </motion.div>
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
                t("signin")
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Login;
