import React from "react";
import { motion } from "framer-motion";

const SegmentDisplay = ({ value, label, unit, icon: Icon }) => {
  // Convert value to string and pad with zeros if needed
  const displayValue = String(value).padStart(4, "0");

  return (
    <div className="segment-display">
      {Icon && (
        <div className="segment-icon">
          <Icon size={24} />
        </div>
      )}
      <div className="segment-value">
        {[...displayValue].map((digit, index) => (
          <motion.div
            key={index}
            className="segment-digit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {digit}
          </motion.div>
        ))}
        {unit && <span className="segment-unit">{unit}</span>}
      </div>
      {label && <div className="segment-label">{label}</div>}
    </div>
  );
};

export default SegmentDisplay;
