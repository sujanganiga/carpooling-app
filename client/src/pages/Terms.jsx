import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const Terms = () => {
  const { t } = useTranslation();

  const sections = [
    {
      title: t("termsAcceptance") || "Acceptance of Terms",
      content:
        t("termsAcceptanceContent") ||
        "By accessing and using the Carpool application, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our service.",
    },
    {
      title: t("termsUserEligibility") || "User Eligibility",
      content:
        t("termsUserEligibilityContent") ||
        "You must be at least 18 years old to use our service. By using Carpool, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms.",
    },
    {
      title: t("termsAccountRegistration") || "Account Registration",
      content:
        t("termsAccountRegistrationContent") ||
        "To use certain features of our service, you must register for an account. You agree to provide accurate and complete information during registration and to keep your account information updated.",
    },
    {
      title: t("termsUserConduct") || "User Conduct",
      content:
        t("termsUserConductContent") ||
        "You agree to use our service only for lawful purposes and in accordance with these Terms. You shall not use our service to violate any laws or regulations, or to harass, abuse, or harm others.",
    },
    {
      title: t("termsPaymentTerms") || "Payment Terms",
      content:
        t("termsPaymentTermsContent") ||
        "All payments for rides must be made through our secure payment system. We reserve the right to modify our pricing at any time. Refunds are subject to our refund policy.",
    },
    {
      title: t("termsCancellationPolicy") || "Cancellation Policy",
      content:
        t("termsCancellationPolicyContent") ||
        "Users may cancel rides up to 1 hour before the scheduled time. Cancellations made within 1 hour of the scheduled time may be subject to a cancellation fee.",
    },
    {
      title: t("termsPrivacyPolicy") || "Privacy Policy",
      content:
        t("termsPrivacyPolicyContent") ||
        "Your use of our service is also governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.",
    },
    {
      title: t("termsIntellectualProperty") || "Intellectual Property",
      content:
        t("termsIntellectualPropertyContent") ||
        "All content, features, and functionality of our service are owned by Carpool and are protected by international copyright, trademark, and other intellectual property laws.",
    },
    {
      title: t("termsLimitationOfLiability") || "Limitation of Liability",
      content:
        t("termsLimitationOfLiabilityContent") ||
        "To the maximum extent permitted by law, Carpool shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our service.",
    },
    {
      title: t("termsTermination") || "Termination",
      content:
        t("termsTerminationContent") ||
        "We reserve the right to terminate or suspend your account and access to our service at any time, without notice, for any reason, including violation of these Terms.",
    },
    {
      title: t("termsChangesToTerms") || "Changes to Terms",
      content:
        t("termsChangesToTermsContent") ||
        "We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on our website and updating the effective date.",
    },
    {
      title: t("termsGoverningLaw") || "Governing Law",
      content:
        t("termsGoverningLawContent") ||
        "These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Carpool operates, without regard to its conflict of law provisions.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {t("termsAndConditions") || "Terms and Conditions"}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {t("termsLastUpdated") || "Last updated: January 1, 2024"}
        </p>
      </motion.div>

      <div className="space-y-8">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {section.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {section.content}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="mt-12 text-center text-gray-600 dark:text-gray-300"
      >
        <p>
          {t("termsContact") ||
            "If you have any questions about these Terms, please contact us at"}{" "}
          <a
            href="mailto:legal@carpool.com"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
          >
            legal@carpool.com
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Terms;
