import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Register = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
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
        staggerChildren: 0.1,
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

  const InputField = ({ name, type = "text", required = true }) => (
    <motion.div
      variants={itemVariants}
      className="group relative"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <label
        htmlFor={name}
        className={`absolute left-4 transition-all duration-200 ${
          focusedField === name || formData[name]
            ? "-top-2 text-xs text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 px-2"
            : "top-3 text-gray-500 dark:text-gray-400"
        }`}
      >
        {t(name)}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={name === "password" ? "new-password" : name}
        required={required}
        value={formData[name]}
        onChange={handleChange}
        onFocus={() => setFocusedField(name)}
        onBlur={() => setFocusedField(null)}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-transparent"
      />
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700 rounded-3xl shadow-2xl p-8"
      >
        <motion.h2
          variants={itemVariants}
          className="text-center text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6"
        >
          {t("createNewAccount")}
        </motion.h2>

        <motion.p
          variants={itemVariants}
          className="text-center text-sm text-gray-600 dark:text-gray-400 mb-8"
        >
          {t("or")}{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
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
              className="flex items-center mb-6 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 p-4 rounded-lg border border-red-300 dark:border-red-700"
            >
              <span className="text-sm">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form
          variants={itemVariants}
          className="space-y-5"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <InputField name="name" />
            <InputField name="email" type="email" />
            <InputField name="password" type="password" />
            <InputField name="phone" type="tel" required={false} />
          </div>

          <motion.div variants={itemVariants} className="pt-2">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

        <motion.div variants={itemVariants} className="mt-6 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t("byRegistering")}, you agree to our{" "}
            <Link
              to="/terms"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
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
