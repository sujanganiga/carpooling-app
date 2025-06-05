import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import {
  FaHome,
  FaSearch,
  FaPlusCircle,
  FaCar,
  FaUser,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { FaTh } from "react-icons/fa";
import LanguageSwitcher from "./LanguageSwitcher";

const Layout = ({ children }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHomePage = location.pathname === "/";

  const navigation = [
    {
      name: t("home"),
      href: "/",
      icon: <FaHome />,
      current: location.pathname === "/",
    },
    {
      name: t("dashboard"),
      href: "/dashboard",
      icon: <FaTh />,
      current: location.pathname === "/dashboard",
    },
    {
      name: t("findRide"),
      href: "/find-ride",
      icon: <FaSearch />,
      current: location.pathname === "/find-ride",
    },
    {
      name: t("offerRide"),
      href: "/offer-ride",
      icon: <FaPlusCircle />,
      current: location.pathname === "/offer-ride",
      driverOnly: true,
    },
    {
      name: t("myRides"),
      href: "/my-rides",
      icon: <FaCar />,
      current: location.pathname === "/my-rides",
    },
    {
      name: t("profile"),
      href: "/profile",
      icon: <FaUser />,
      current: location.pathname === "/profile",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-teal-50 text-gray-800 font-sans">
      {/* Top Navbar */}
      {!isHomePage && (
        <header className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <span className="text-2xl font-bold text-indigo-600">
                  Carpool
                </span>
              </div>
              {/* Desktop Nav */}
              <div className="hidden lg:flex lg:space-x-6">
                {navigation.map((item) =>
                  !item.driverOnly || (item.driverOnly && user?.isDriver) ? (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        item.current
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  ) : null
                )}
              </div>
              {/* Actions */}
              <div className="flex items-center space-x-4">
                <LanguageSwitcher />
                {user ? (
                  <button
                    onClick={logout}
                    className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                  >
                    {t("logout")}
                  </button>
                ) : (
                  <div className="hidden lg:flex lg:items-center lg:space-x-4">
                    <Link
                      to="/login"
                      className="text-sm font-semibold text-gray-700 hover:text-indigo-600 transition-colors duration-200"
                    >
                      {t("login")}
                    </Link>
                    <Link
                      to="/register"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-all duration-300"
                    >
                      {t("register")}
                    </Link>
                  </div>
                )}
                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="lg:hidden text-gray-700 hover:text-gray-900"
                >
                  {mobileOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
              </div>
            </div>
          </div>
          {/* Mobile Nav */}
          {mobileOpen && (
            <div className="lg:hidden bg-white/90 backdrop-blur-md pb-4 border-t border-gray-200">
              <nav className="px-4 pt-2 space-y-2">
                {navigation.map((item) =>
                  !item.driverOnly || (item.driverOnly && user?.isDriver) ? (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium transition-colors duration-200 ${
                        item.current
                          ? "bg-indigo-100 text-indigo-700"
                          : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  ) : null
                )}
                {user ? (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <FaTimes />
                    <span className="text-sm font-medium">{t("logout")}</span>
                  </button>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                    >
                      <FaUser />
                      <span className="text-sm font-medium">{t("login")}</span>
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <FaUser />
                      <span className="text-sm font-medium">
                        {t("register")}
                      </span>
                    </Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </header>
      )}

      {/* Main content area */}
      <main className="flex-1 overflow-auto p-6 sm:p-8">{children}</main>

      {/* Footer */}
      {!isHomePage && (
        <footer className="bg-white border-t shadow-inner mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm text-gray-600">
              {/* Brand Info */}
              <div>
                <h3 className="text-indigo-600 font-bold text-lg mb-2">
                  Carpool
                </h3>
                <p>
                  {t("footer.description") ||
                    "Connecting people. Saving the planet."}
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold mb-2">
                  {t("quickLinks") || "Quick Links"}
                </h4>
                <ul className="space-y-1">
                  <li>
                    <Link to="/dashboard" className="hover:text-indigo-600">
                      {t("dashboard")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/find-ride" className="hover:text-indigo-600">
                      {t("findRide")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/offer-ride" className="hover:text-indigo-600">
                      {t("offerRide")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="hover:text-indigo-600">
                      {t("profile")}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h4 className="font-semibold mb-2">
                  {t("support") || "Support"}
                </h4>
                <ul className="space-y-1">
                  <li>
                    <Link to="/help" className="hover:text-indigo-600">
                      {t("helpCenter") || "Help Center"}
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-indigo-600">
                      {t("contactUs") || "Contact Us"}
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="hover:text-indigo-600">
                      {t("faq") || "FAQ"}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Socials */}
              <div>
                <h4 className="font-semibold mb-2">
                  {t("followUs") || "Follow Us"}
                </h4>
                <div className="flex space-x-4 text-xl">
                  <a
                    href="https://facebook.com"
                    className="text-blue-600 hover:text-blue-800"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-facebook"></i>
                  </a>
                  <a
                    href="https://twitter.com"
                    className="text-blue-400 hover:text-blue-600"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a
                    href="https://instagram.com"
                    className="text-pink-500 hover:text-pink-700"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a
                    href="https://linkedin.com"
                    className="text-blue-700 hover:text-blue-900"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fab fa-linkedin"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom line */}
            <div className="mt-8 border-t pt-4 text-center text-gray-500 text-xs">
              © {new Date().getFullYear()} Carpool App.{" "}
              {t("allRightsReserved") || "All rights reserved."}
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;
