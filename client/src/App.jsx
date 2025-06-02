import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import i18n from "./i18n/i18n";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import FindRide from "./pages/FindRide";
import OfferRide from "./pages/OfferRide";
import MyRides from "./pages/MyRides";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/find-ride"
                  element={
                    <ProtectedRoute>
                      <FindRide />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/offer-ride"
                  element={
                    <ProtectedRoute>
                      <OfferRide />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/my-rides"
                  element={
                    <ProtectedRoute>
                      <MyRides />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Layout>
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </I18nextProvider>
  );
}

export default App;
