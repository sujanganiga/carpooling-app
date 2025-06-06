import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaChevronDown,
  FaChevronUp,
  FaBook,
  FaQuestionCircle,
  FaUserPlus,
  FaCar,
} from "react-icons/fa";

const HelpCenter = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState(null);
  const [activeFAQ, setActiveFAQ] = useState(null);

  const guides = [
    {
      icon: (
        <FaUserPlus className="text-3xl text-indigo-600 dark:text-indigo-400" />
      ),
      title: t("gettingStarted") || "Getting Started",
      description:
        t("gettingStartedDesc") ||
        "Learn how to create an account and start using Carpool.",
      content:
        t("gettingStartedContent") ||
        "To get started with Carpool, follow these simple steps:\n1. Create an account\n2. Complete your profile\n3. Add your payment method\n4. Start booking rides or offering rides",
    },
    {
      icon: <FaCar className="text-3xl text-indigo-600 dark:text-indigo-400" />,
      title: t("bookingRides") || "Booking Rides",
      description:
        t("bookingRidesDesc") ||
        "Everything you need to know about booking and managing your rides.",
      content:
        t("bookingRidesContent") ||
        "Booking a ride is easy:\n1. Search for available rides\n2. Select your preferred ride\n3. Confirm your booking\n4. Track your ride in real-time",
    },
    {
      icon: (
        <FaBook className="text-3xl text-indigo-600 dark:text-indigo-400" />
      ),
      title: t("driverGuide") || "Driver's Guide",
      description:
        t("driverGuideDesc") ||
        "Become a driver and start earning with Carpool.",
      content:
        t("driverGuideContent") ||
        "To become a driver:\n1. Apply to be a driver\n2. Complete verification\n3. Set your schedule\n4. Start accepting ride requests",
    },
  ];

  const faqs = [
    {
      question: t("faq1Question") || "How do I cancel a ride?",
      answer:
        t("faq1Answer") ||
        "You can cancel a ride up to 1 hour before the scheduled time through the 'My Rides' section. Cancellations may be subject to a fee depending on the timing.",
    },
    {
      question: t("faq2Question") || "What payment methods are accepted?",
      answer:
        t("faq2Answer") ||
        "We accept all major credit cards, debit cards, and digital payment methods including PayPal and Apple Pay.",
    },
    {
      question: t("faq3Question") || "How do I become a driver?",
      answer:
        t("faq3Answer") ||
        "To become a driver, you need to be at least 21 years old, have a valid driver's license, and pass our background check. Apply through the 'Become a Driver' section in your profile.",
    },
    {
      question: t("faq4Question") || "Is my payment information secure?",
      answer:
        t("faq4Answer") ||
        "Yes, we use industry-standard encryption to protect your payment information. We never store your full credit card details on our servers.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t("helpCenter") || "Help Center"}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t("helpCenterDescription") ||
            "Find answers to your questions and learn how to make the most of Carpool."}
        </p>
      </motion.div>

      {/* Guides Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          {t("guides") || "Guides"}
        </h2>
        <div className="space-y-4">
          {guides.map((guide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() =>
                  setActiveSection(activeSection === index ? null : index)
                }
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  {guide.icon}
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {guide.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {guide.description}
                    </p>
                  </div>
                </div>
                {activeSection === index ? (
                  <FaChevronUp className="text-gray-500" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}
              </button>
              <AnimatePresence>
                {activeSection === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <div className="prose dark:prose-invert max-w-none">
                      {guide.content.split("\n").map((line, i) => (
                        <p key={i} className="text-gray-600 dark:text-gray-300">
                          {line}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          {t("frequentlyAskedQuestions") || "Frequently Asked Questions"}
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <FaQuestionCircle className="text-2xl text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                  </h3>
                </div>
                {activeFAQ === index ? (
                  <FaChevronUp className="text-gray-500" />
                ) : (
                  <FaChevronDown className="text-gray-500" />
                )}
              </button>
              <AnimatePresence>
                {activeFAQ === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6"
                  >
                    <p className="text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
