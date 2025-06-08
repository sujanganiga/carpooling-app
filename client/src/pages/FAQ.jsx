import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const FAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: t("faq.howItWorks") || "How does carpooling work?",
      answer:
        t("faq.howItWorksAnswer") ||
        "Carpooling is a ride-sharing service where drivers can offer empty seats in their car to passengers heading in the same direction. Passengers can book these seats, share the cost of the journey, and enjoy a more sustainable way of traveling.",
    },
    {
      question: t("faq.payment") || "How do payments work?",
      answer:
        t("faq.paymentAnswer") ||
        "Payments are processed securely through our platform. The fare is calculated based on the distance and split among passengers. You can pay using various methods including credit/debit cards and digital wallets.",
    },
    {
      question: t("faq.safety") || "Is carpooling safe?",
      answer:
        t("faq.safetyAnswer") ||
        "Yes, we take safety seriously. All users are verified, and we have a rating system for both drivers and passengers. You can see reviews and ratings before booking a ride, and we provide real-time tracking during the journey.",
    },
    {
      question: t("faq.cancellation") || "What is the cancellation policy?",
      answer:
        t("faq.cancellationAnswer") ||
        "You can cancel a ride up to 2 hours before the scheduled departure time without any charges. Cancellations made within 2 hours may incur a small fee to compensate the driver.",
    },
    {
      question: t("faq.becomeDriver") || "How can I become a driver?",
      answer:
        t("faq.becomeDriverAnswer") ||
        "To become a driver, you need to register, provide your driver's license, vehicle information, and complete a background check. Once approved, you can start offering rides to passengers.",
    },
    {
      question: t("faq.insurance") || "Is there insurance coverage?",
      answer:
        t("faq.insuranceAnswer") ||
        "Yes, all rides are covered by our insurance policy. This includes liability coverage for both drivers and passengers during the journey.",
    },
    {
      question: t("faq.luggage") || "Can I bring luggage?",
      answer:
        t("faq.luggageAnswer") ||
        "Yes, you can bring luggage. However, please specify the size and quantity when booking to ensure there's enough space in the vehicle.",
    },
    {
      question: t("faq.pets") || "Can I travel with pets?",
      answer:
        t("faq.petsAnswer") ||
        "This depends on the driver's preference. You can specify if you're traveling with pets when booking, and the driver can accept or decline based on their comfort level.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t("faq.title") || "Frequently Asked Questions"}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t("faq.subtitle") ||
            "Find answers to common questions about our carpooling service"}
        </p>
      </motion.div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-4 text-left focus:outline-none"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <FaChevronUp className="text-indigo-600 dark:text-indigo-400" />
                ) : (
                  <FaChevronDown className="text-indigo-600 dark:text-indigo-400" />
                )}
              </div>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-4"
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {t("faq.needMoreHelp") || "Still have questions?"}
        </p>
        <a
          href="/contact"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          {t("faq.contactUs") || "Contact Us"}
        </a>
      </motion.div>
    </div>
  );
};

export default FAQ;
