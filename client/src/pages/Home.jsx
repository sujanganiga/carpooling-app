import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  FaCar,
  FaUsers,
  FaLeaf,
  FaMapMarkedAlt,
  FaMoneyBillWave,
  FaShieldAlt,
} from "react-icons/fa";

const Home = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDashboardClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login", { state: { from: "/dashboard" } });
    }
  };

  const features = [
    {
      title: t("findRide"),
      description: t("findRideDesc"),
      icon: <FaMapMarkedAlt className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: t("offerRide"),
      description: t("offerRideDesc"),
      icon: <FaCar className="w-8 h-8" />,
      color: "from-indigo-500 to-indigo-600",
    },
    {
      title: t("saveMoney"),
      description: t("saveMoneyDesc"),
      icon: <FaMoneyBillWave className="w-8 h-8" />,
      color: "from-green-500 to-green-600",
    },
  ];

  const benefits = [
    {
      title: "Eco-Friendly",
      description: "Reduce your carbon footprint by sharing rides",
      icon: <FaLeaf className="w-6 h-6" />,
    },
    {
      title: "Community",
      description: "Connect with fellow travelers in your area",
      icon: <FaUsers className="w-6 h-6" />,
    },
    {
      title: "Safe & Secure",
      description: "Verified users and secure payment system",
      icon: <FaShieldAlt className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/90 to-indigo-700/90 dark:from-blue-600/90 dark:to-indigo-800/90 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3')] bg-cover bg-center bg-no-repeat transform scale-105" />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {t("tagline")}
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-3xl mx-auto">
              {t("subtitle")}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDashboardClick}
              className="bg-white dark:bg-gray-100 text-indigo-700 dark:text-indigo-800 px-8 py-4 rounded-full font-bold text-xl hover:bg-gray-100 dark:hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {user ? t("goToDashboard") : t("getStarted")}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section with Cards */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("howItWorks")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Simple steps to start your journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl" />
                <div className="relative bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div
                    className={`inline-block p-4 rounded-xl bg-gradient-to-r ${feature.color} text-white mb-6`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section with Icons */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section with Modern Design */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("userTestimonials")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              What our users say about us
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: item * 0.2 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="text-yellow-400 text-2xl">★★★★★</div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic text-lg">
                  "{t(`testimonial${item}`)}"
                </p>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {t(`user${item}`).charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {t(`user${item}`)}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      {t("passenger")}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-700 dark:to-blue-700 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto text-white/90">
              Join thousands of users who are already saving money and reducing
              their carbon footprint.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDashboardClick}
              className="bg-white text-indigo-700 px-8 py-4 rounded-full font-bold text-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {user ? t("goToDashboard") : t("getStarted")}
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
