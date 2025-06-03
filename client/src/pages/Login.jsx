import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-50 via-white to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-md border border-gray-200 rounded-3xl shadow-2xl p-8 animate-slide-in-up">
        <h2 className="text-center text-3xl font-extrabold text-teal-700 mb-6 animate-fade-in">
          {t("signinToAccount")}
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          {t("or")}{" "}
          <Link
            to="/register"
            className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
          >
            {t("createNewAccount")}
          </Link>
        </p>

        {error && (
          <div className="flex items-center mb-6 bg-red-100 text-red-700 p-3 rounded-lg border border-red-300 animate-fade-in">
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="group">
              <label htmlFor="email" className="sr-only">
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
                placeholder={t("email")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div className="group">
              <label htmlFor="password" className="sr-only">
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
                placeholder={t("password")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? t("loading") + "..." : t("signin")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
