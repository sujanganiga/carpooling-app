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
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-700 dark:from-blue-600 dark:to-indigo-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t("tagline")}
          </h1>
          <p className="text-xl mb-10 max-w-3xl mx-auto">{t("subtitle")}</p>

          {/* Dashboard Button - Primary CTA */}
          <button
            onClick={handleDashboardClick}
            className="bg-white dark:bg-gray-100 text-indigo-700 dark:text-indigo-800 px-8 py-4 rounded-full font-bold text-xl hover:bg-gray-100 dark:hover:bg-gray-200 transition transform hover:scale-105 shadow-lg mb-6"
          >
            {user ? t("goToDashboard") : t("getStarted")}
          </button>
        </div>
      </section>

      {/* Features Walkthrough */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800 dark:text-gray-200">
            {t("howItWorks")}
          </h2>

          <Carousel
            showArrows={true}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
            className="custom-carousel"
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="px-10 py-12 bg-gray-50 dark:bg-gray-800 rounded-xl"
              >
                <div className="text-6xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {feature.description}
                </p>
              </div>
            ))}
          </Carousel>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 dark:bg-gray-800 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-800 dark:text-gray-200">
            {t("userTestimonials")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white dark:bg-gray-700 p-8 rounded-xl shadow-md"
              >
                <div className="flex items-center mb-4">
                  <div className="text-yellow-400 text-2xl">★★★★★</div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                  "{t(`testimonial${item}`)}"
                </p>
                <div className="flex items-center">
                  <div className="bg-gray-200 dark:bg-gray-600 border-2 border-dashed border-gray-300 dark:border-gray-500 rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">
                      {t(`user${item}`)}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      {t("passenger")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-indigo-700 dark:bg-indigo-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <button
            onClick={handleDashboardClick}
            className="bg-white dark:bg-gray-100 text-indigo-700 dark:text-indigo-800 px-8 py-4 rounded-full font-bold text-xl hover:bg-gray-100 dark:hover:bg-gray-200 transition transform hover:scale-105 shadow-lg"
          >
            {user ? t("goToDashboard") : t("getStarted")}
          </button>
        </div>
      </section>

      {/* Add custom styles for carousel in dark mode */}
      <style jsx>{`
        .custom-carousel .carousel .control-arrow {
          background: rgba(0, 0, 0, 0.2);
        }
        .dark .custom-carousel .carousel .control-arrow {
          background: rgba(255, 255, 255, 0.2);
        }
        .custom-carousel .carousel .control-arrow:hover {
          background: rgba(0, 0, 0, 0.4);
        }
        .dark .custom-carousel .carousel .control-arrow:hover {
          background: rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </div>
  );
};

export default Home;
