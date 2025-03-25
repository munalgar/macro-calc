import React from "react";

const MacroChart = ({ output }) => {
  // Calculate percentages for easier reference
  const proteinPercent = Math.round(
    (output.proteinCalories / output.calories) * 100
  );
  const carbsPercent = Math.round(
    (output.carbsCalories / output.calories) * 100
  );
  const fatPercent = Math.round((output.fatCalories / output.calories) * 100);

  return (
    <div className="macro-chart-container">
      <h3
        style={{ color: "#3498db", marginBottom: "15px", fontSize: "1.2rem" }}
      >
        Macronutrient Breakdown
      </h3>

      <div className="donut-chart-wrapper">
        <div className="donut-chart">
          {/* SVG Donut Chart */}
          <svg viewBox="-10 -10 120 120" className="donut-svg">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#34495e"
              strokeWidth="20"
            />

            {/* Protein segment - starts at top (0 degrees) */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#27ae60"
              strokeWidth="20"
              strokeDasharray={`${
                (output.proteinCalories / output.calories) * 251.2
              } 251.2`}
              strokeDashoffset="0"
              className="donut-segment"
            />

            {/* Carbs segment - starts after protein */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#3498db"
              strokeWidth="20"
              strokeDasharray={`${
                (output.carbsCalories / output.calories) * 251.2
              } 251.2`}
              strokeDashoffset={`${
                -1 * (output.proteinCalories / output.calories) * 251.2
              }`}
              className="donut-segment"
            />

            {/* Fat segment - starts after protein and carbs */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#e74c3c"
              strokeWidth="20"
              strokeDasharray={`${
                (output.fatCalories / output.calories) * 251.2
              } 251.2`}
              strokeDashoffset={`${
                -1 *
                ((output.proteinCalories + output.carbsCalories) /
                  output.calories) *
                251.2
              }`}
              className="donut-segment"
            />
          </svg>
        </div>
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <span className="legend-color protein"></span>
          <span className="legend-text">Protein: {proteinPercent}%</span>
        </div>
        <div className="legend-item">
          <span className="legend-color carbs"></span>
          <span className="legend-text">Carbs: {carbsPercent}%</span>
        </div>
        <div className="legend-item">
          <span className="legend-color fat"></span>
          <span className="legend-text">Fat: {fatPercent}%</span>
        </div>
      </div>
    </div>
  );
};

export default MacroChart;
