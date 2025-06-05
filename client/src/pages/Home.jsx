import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Home = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      title: t("findRide"),
      description: t("findRideDesc"),
      icon: "🔍",
    },
    {
      title: t("offerRide"),
      description: t("offerRideDesc"),
      icon: "🚗",
    },
    {
      title: t("saveMoney"),
      description: t("saveMoneyDesc"),
      icon: "💰",
    },
  ];

  const handleDashboardClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login", { state: { from: "/dashboard" } });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t("tagline")}
          </h1>
          <p className="text-xl mb-10 max-w-3xl mx-auto">{t("subtitle")}</p>

          {/* Dashboard Button - Primary CTA */}
          <button
            onClick={handleDashboardClick}
            className="bg-white text-indigo-700 px-8 py-4 rounded-full font-bold text-xl hover:bg-gray-100 transition transform hover:scale-105 shadow-lg mb-6"
          >
            {user ? t("goToDashboard") : t("getStarted")}
          </button>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/find-ride"
              className="bg-transparent border-2 border-white px-6 py-2 rounded-full font-bold hover:bg-white hover:text-indigo-700 transition"
            >
              {t("findRideBtn")}
            </Link>
            <Link
              to="/offer-ride"
              className="bg-transparent border-2 border-white px-6 py-2 rounded-full font-bold hover:bg-white hover:text-indigo-700 transition"
            >
              {t("offerRideBtn")}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Walkthrough */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            {t("howItWorks")}
          </h2>

          <Carousel
            showArrows={true}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
          >
            {features.map((feature, index) => (
              <div key={index} className="px-10 py-12 bg-gray-50 rounded-xl">
                <div className="text-6xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {feature.description}
                </p>
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            {t("userTestimonials")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white p-8 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 text-2xl">★★★★★</div>
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{t(`testimonial${item}`)}"
                </p>
                <div className="flex items-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <h4 className="font-bold">{t(`user${item}`)}</h4>
                    <p className="text-gray-500">{t("passenger")}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-indigo-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <button
            onClick={handleDashboardClick}
            className="bg-white text-indigo-700 px-8 py-4 rounded-full font-bold text-xl hover:bg-gray-100 transition transform hover:scale-105 shadow-lg"
          >
            {user ? t("goToDashboard") : t("getStarted")}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
