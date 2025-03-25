import React from "react";
import MacroChart from "./MacroChart";

const MacroOutput = ({ output }) => {
  // Helper function to get goal emoji
  const getGoalEmoji = (goal) => {
    switch (goal) {
      case "maintain":
        return "⚖️";
      case "gain":
        return "⬆️";
      case "lose":
        return "⬇️";
      default:
        return "🎯";
    }
  };

  return (
    <div className="output-container">
      <div className="output-header">
        <h2>🎉 Your Macro Calculation Results</h2>
        <div className="output-goal">
          Goal:{" "}
          <span className="highlight">
            {getGoalEmoji(output.goal)} {output.goal}
          </span>
        </div>
      </div>

      <div className="output-content">
        <div className="calories-section">
          <div className="calories-total">
            <span className="calories-value">{output.calories}</span>
            <span className="calories-unit">calories/day 🔥</span>
          </div>
          <div className="calories-info">
            Based on your TDEE of {output.tdee} calories
          </div>
        </div>

        <div className="macro-distribution">
          <h3>📊 Daily Macro Breakdown</h3>

          <div className="results-stack">
            <div className="macro-result protein-result">
              <div className="macro-icon">🥩</div>
              <div className="macro-details">
                <p className="macro-name">Protein</p>
                <p className="macro-value">{output.protein}g</p>
                <p className="macro-calories">
                  {output.proteinCalories} cal (
                  {Math.round((output.proteinCalories / output.calories) * 100)}
                  %)
                </p>
              </div>
            </div>

            <div className="macro-result carbs-result">
              <div className="macro-icon">🍚</div>
              <div className="macro-details">
                <p className="macro-name">Carbs</p>
                <p className="macro-value">{output.carbs}g</p>
                <p className="macro-calories">
                  {output.carbsCalories} cal (
                  {Math.round((output.carbsCalories / output.calories) * 100)}%)
                </p>
              </div>
            </div>

            <div className="macro-result fat-result">
              <div className="macro-icon">🥑</div>
              <div className="macro-details">
                <p className="macro-name">Fat</p>
                <p className="macro-value">{output.fat}g</p>
                <p className="macro-calories">
                  {output.fatCalories} cal (
                  {Math.round((output.fatCalories / output.calories) * 100)}%)
                </p>
              </div>
            </div>
          </div>
        </div>

        <MacroChart output={output} />
      </div>
    </div>
  );
};

export default MacroOutput;
