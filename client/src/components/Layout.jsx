import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import LanguageSwitcher from "./LanguageSwitcher";

const Layout = ({ children }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: t("dashboard"), href: "/", current: location.pathname === "/" },
    {
      name: t("findRide"),
      href: "/find-ride",
      current: location.pathname === "/find-ride",
    },
    {
      name: t("offerRide"),
      href: "/offer-ride",
      current: location.pathname === "/offer-ride",
      driverOnly: true,
    },
    {
      name: t("myRides"),
      href: "/my-rides",
      current: location.pathname === "/my-rides",
    },
    {
      name: t("profile"),
      href: "/profile",
      current: location.pathname === "/profile",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="text-xl font-bold text-primary-600">Carpool</div>
              <div className="hidden md:ml-10 md:flex md:space-x-8">
                {navigation.map((item) => {
                  if (item.driverOnly && !user?.isDriver) return null;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`${
                        item.current
                          ? "border-primary-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              {user ? (
                <button
                  onClick={logout}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  {t("logout")}
                </button>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    {t("login")}
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    {t("register")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Carpool App. {t("allRightsReserved")}.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
