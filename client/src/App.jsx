import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { I18nextProvider, useTranslation } from "react-i18next";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import i18n from "./i18n/i18n";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import DriftLoading from "./components/DriftLoading";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import FindRide from "./pages/FindRide";
import OfferRide from "./pages/OfferRide";
import MyRides from "./pages/MyRides";
import Home from "./pages/Home";

// New DriverRoute component
const DriverRoute = ({ children }) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (!user?.isDriver) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">
          {t("driverModeRequired")}
        </h2>
        <p className="mb-4">{t("switchToDriverModeMessage")}</p>
        <Link to="/profile" className="btn-primary">
          {t("goToProfile")}
        </Link>
      </div>
    );
  }

  return children;
};

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <LanguageProvider>
          <ThemeProvider>
            <ErrorBoundary>
              <Router>
                <Layout>
                  <Suspense fallback={<DriftLoading />}>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />

                      {/* Protected routes */}
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <Suspense fallback={<DriftLoading />}>
                              <Dashboard />
                            </Suspense>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <Suspense fallback={<DriftLoading />}>
                              <Profile />
                            </Suspense>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/find-ride"
                        element={
                          <ProtectedRoute>
                            <Suspense fallback={<DriftLoading />}>
                              <FindRide />
                            </Suspense>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/offer-ride"
                        element={
                          <ProtectedRoute>
                            <DriverRoute>
                              <Suspense fallback={<DriftLoading />}>
                                <OfferRide />
                              </Suspense>
                            </DriverRoute>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/my-rides"
                        element={
                          <ProtectedRoute>
                            <Suspense fallback={<DriftLoading />}>
                              <MyRides />
                            </Suspense>
                          </ProtectedRoute>
                        }
                      />
                    </Routes>
                  </Suspense>
                </Layout>
              </Router>
            </ErrorBoundary>
          </ThemeProvider>
        </LanguageProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;
