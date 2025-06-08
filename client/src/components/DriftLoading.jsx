import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const DriftLoading = ({ variant = "overlay" }) => {
  const [audio, setAudio] = useState(null);
  const [soundError, setSoundError] = useState(false);

  useEffect(() => {
    try {
      const driftSound = new Audio("/drift-sound.mp3");
      driftSound.volume = 0.3;
      driftSound.addEventListener("error", () => {
        setSoundError(true);
      });
      const playPromise = driftSound.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setAudio(driftSound))
          .catch(() => setSoundError(true));
      }
      return () => {
        if (driftSound) {
          driftSound.pause();
          driftSound.currentTime = 0;
        }
      };
    } catch {
      setSoundError(true);
    }
  }, []);

  // Rotating steering wheel SVG icon
  const steeringWheelIcon = (
    <motion.div
      className={variant === "inline" ? "mb-2" : "mb-6"}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      style={{ display: "inline-block" }}
    >
      <svg
        width={variant === "inline" ? 36 : 72}
        height={variant === "inline" ? 36 : 72}
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle */}
        <circle
          cx="36"
          cy="36"
          r="30"
          stroke="#2563eb"
          strokeWidth="4"
          fill="#f1f5f9"
        />
        {/* Inner circle */}
        <circle
          cx="36"
          cy="36"
          r="10"
          stroke="#0ea5e9"
          strokeWidth="3"
          fill="#fff"
        />
        {/* Spokes */}
        <line
          x1="36"
          y1="36"
          x2="36"
          y2="10"
          stroke="#2563eb"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="36"
          y1="36"
          x2="58"
          y2="54"
          stroke="#2563eb"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <line
          x1="36"
          y1="36"
          x2="14"
          y2="54"
          stroke="#2563eb"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Center hub */}
        <circle cx="36" cy="36" r="4" fill="#2563eb" />
      </svg>
    </motion.div>
  );

  const loadingText = (
    <div
      className={
        variant === "inline"
          ? "text-base font-semibold text-gray-700 text-center"
          : "text-2xl font-bold text-gray-700 mb-2 tracking-wide text-center"
      }
    >
      Drifting to your destination...
    </div>
  );

  const errorText = soundError && (
    <div
      className={
        variant === "inline"
          ? "mt-1 text-xs text-red-500 text-center"
          : "mt-2 text-sm text-red-500 text-center"
      }
    >
      Note: Sound effect could not be loaded
    </div>
  );

  if (variant === "inline") {
    return (
      <div className="flex flex-col items-center justify-center">
        {steeringWheelIcon}
        {loadingText}
        {errorText}
      </div>
    );
  }

  // overlay (default)
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-80">
      {steeringWheelIcon}
      {loadingText}
      {errorText}
    </div>
  );
};

export default DriftLoading;
