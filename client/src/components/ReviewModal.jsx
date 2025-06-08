import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import api from "../utils/api";
import { useTranslation } from "react-i18next";

const ReviewModal = ({ ride, onClose, onReviewSubmitted }) => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Get the driver name from either ride or booking object
  const driverName = ride?.driver?.name || ride?.ride?.driver?.name;

  const handleSubmit = async () => {
    if (rating === 0) {
      setError(t("review.ratingRequired"));
      return;
    }

    setSubmitting(true);

    try {
      await api.post("/api/reviews", {
        rideId: ride?.ride?.id || ride?.id,
        rating,
        comment,
      });

      onReviewSubmitted();
      onClose();
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(err.response?.data?.message || t("review.submitError"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {t("review.title")}
        </h2>

        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            {t("review.rateExperience")} {driverName}
          </p>
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`text-3xl cursor-pointer ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">
            {rating > 0
              ? t("review.ratingSelected", { rating })
              : t("review.selectRating")}
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">
            {t("review.commentLabel")} ({t("optional")})
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows="3"
            placeholder={t("review.commentPlaceholder")}
            maxLength={500}
          />
          <p className="text-sm text-gray-500 text-right">
            {comment.length}/500 {t("characters")}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {submitting ? t("submitting") + "..." : t("submitReview")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
