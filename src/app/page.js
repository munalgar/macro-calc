"use client";

import { useState, useReducer } from "react";
import "./globals.css";

// Initial state for form values
const initialState = {
  sex: "male",
  age: "",
  height: "",
  weight: "",
  goal: "maintain",
  bodyFat: "",
  leanBodyMass: "",
  jobActivity: "1",
  unit: "metric",
  weightLiftingDays: "0",
  weightLiftingMinutes: "",
  weightLiftingIntensity: "1.1",
  cardioDays: "0",
  cardioMinutes: "",
  cardioIntensity: "1.1",
};

// Reducer function to handle state updates
function formReducer(state, action) {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "RESET_WEIGHT_LIFTING":
      return {
        ...state,
        weightLiftingDays: action.days,
        weightLiftingMinutes: "",
        weightLiftingIntensity: "1.1",
      };
    case "RESET_CARDIO":
      return {
        ...state,
        cardioDays: action.days,
        cardioMinutes: "",
        cardioIntensity: "1.1",
      };
    default:
      return state;
  }
}

export default function MacroCalculator() {
  // Use reducer for form state management
  const [formData, dispatch] = useReducer(formReducer, initialState);

  // Output state
  const [showOutput, setShowOutput] = useState(false);
  const [output, setOutput] = useState({
    goal: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    proteinCalories: 0,
    carbsCalories: 0,
    fatCalories: 0,
  });

  // Update field handler
  const updateField = (field, value) => {
    dispatch({ type: "UPDATE_FIELD", field, value });
  };

  // Handle unit change
  const updatePlaceholders = (newUnit) => {
    updateField("unit", newUnit);
  };

  // Toggle weight lifting details
  const toggleWeightLiftingDetails = (days) => {
    dispatch({ type: "RESET_WEIGHT_LIFTING", days });
  };

  // Toggle cardio details
  const toggleCardioDetails = (days) => {
    dispatch({ type: "RESET_CARDIO", days });
  };

  // Calculate macros function
  const calculateMacros = () => {
    if (
      !formData.sex ||
      !formData.age ||
      !formData.height ||
      !formData.weight
    ) {
      alert("Please fill in all required fields: sex, age, height, and weight");
      return;
    }

    if (formData.weightLiftingDays > 0 && !formData.weightLiftingMinutes) {
      alert("Please fill in weight lifting minutes");
      return;
    }

    if (formData.cardioDays > 0 && !formData.cardioMinutes) {
      alert("Please fill in cardio minutes");
      return;
    }

    const caloriesPerGram = {
      protein: 4,
      carbs: 4,
      fat: 9,
    };

    const weightLiftingCaloriesPerDay =
      formData.weightLiftingDays > 0
        ? (parseInt(formData.weightLiftingMinutes) *
            3 *
            parseInt(formData.weightLiftingDays)) /
          7
        : 0;

    const cardioCaloriesPerDay =
      formData.cardioDays > 0
        ? (parseInt(formData.cardioMinutes) *
            5 *
            parseInt(formData.cardioDays)) /
          7
        : 0;

    let heightInCm, weightInKg;
    if (formData.unit === "imperial") {
      heightInCm = parseFloat(formData.height) * 2.54;
      weightInKg = parseFloat(formData.weight) * 0.453592;
    } else {
      heightInCm = parseFloat(formData.height);
      weightInKg = parseFloat(formData.weight);
    }

    let BMR;
    if (formData.sex === "male") {
      BMR =
        88.362 +
        13.397 * weightInKg +
        4.799 * heightInCm -
        5.677 * parseInt(formData.age);
    } else {
      BMR =
        447.593 +
        9.247 * weightInKg +
        3.098 * heightInCm -
        4.33 * parseInt(formData.age);
    }

    let LBM = parseFloat(formData.leanBodyMass);
    const BF = parseFloat(formData.bodyFat);

    if (!isNaN(LBM)) {
      // Use user-provided LBM
    } else if (!isNaN(BF)) {
      LBM = (1 - BF / 100) * weightInKg;
    } else {
      LBM =
        formData.sex === "male"
          ? (1 - 0.12) * weightInKg
          : (1 - 0.25) * weightInKg;
    }

    const jobActivityMultiplier = parseFloat(formData.jobActivity) + 0.2;
    const weightLiftingMultiplier =
      parseInt(formData.weightLiftingDays) > 0
        ? parseFloat(formData.weightLiftingIntensity) + 0.2
        : 1.0;
    const cardioMultiplier =
      parseInt(formData.cardioDays) > 0
        ? parseFloat(formData.cardioIntensity) + 0.2
        : 1.0;

    const weightedActivityMultiplier =
      0.2 * jobActivityMultiplier +
      0.35 * weightLiftingMultiplier +
      0.45 * cardioMultiplier;

    let calories =
      BMR * weightedActivityMultiplier +
      weightLiftingCaloriesPerDay +
      cardioCaloriesPerDay;

    if (formData.goal === "gain") {
      calories += 500;
    } else if (formData.goal === "lose") {
      calories -= 500;
    }

    let protein = LBM * 2.2;
    let proteinCalories = protein * caloriesPerGram.protein;
    let fat = weightInKg * 1;
    let fatCalories = fat * caloriesPerGram.fat;
    let carbs =
      (calories -
        protein * caloriesPerGram.protein -
        fat * caloriesPerGram.fat) /
      caloriesPerGram.carbs;
    let carbCalories = carbs * caloriesPerGram.carbs;

    let goalText;
    switch (formData.goal) {
      case "gain":
        goalText = "Weight Gain";
        break;
      case "lose":
        goalText = "Weight Loss";
        break;
      default:
        goalText = "Maintenance";
    }

    setOutput({
      goal: goalText,
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
      proteinCalories: Math.round(proteinCalories),
      carbsCalories: Math.round(carbCalories),
      fatCalories: Math.round(fatCalories),
    });

    setShowOutput(true);
  };

  return (
    <main className="container">
      <h1>Macro Calculator</h1>

      <div className="calculator-container">
        <div className="form-group">
          <label className="center-label">Unit:</label>
          <div className="unit-toggle">
            <button
              onClick={() => updatePlaceholders("imperial")}
              className={formData.unit === "imperial" ? "selected" : ""}
              aria-pressed={formData.unit === "imperial"}
            >
              Imperial
            </button>
            <button
              onClick={() => updatePlaceholders("metric")}
              className={formData.unit === "metric" ? "selected" : ""}
              aria-pressed={formData.unit === "metric"}
            >
              Metric
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="sex">Sex:</label>
          <select
            id="sex"
            value={formData.sex}
            onChange={(e) => updateField("sex", e.target.value)}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            min="18"
            max="120"
            placeholder="Age (years)"
            value={formData.age}
            onChange={(e) => updateField("age", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="height">Height:</label>
          <input
            type="number"
            id="height"
            min="1"
            step="0.01"
            placeholder={
              formData.unit === "imperial" ? "Height (inches)" : "Height (cm)"
            }
            value={formData.height}
            onChange={(e) => updateField("height", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="weight">Weight:</label>
          <input
            type="number"
            id="weight"
            min="1"
            step="0.01"
            placeholder={
              formData.unit === "imperial" ? "Weight (lbs)" : "Weight (kg)"
            }
            value={formData.weight}
            onChange={(e) => updateField("weight", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="goal">Goal:</label>
          <select
            id="goal"
            value={formData.goal}
            onChange={(e) => updateField("goal", e.target.value)}
          >
            <option value="maintain">Maintain weight</option>
            <option value="gain">Gain weight</option>
            <option value="lose">Lose weight</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="body-fat">Body Fat % (optional):</label>
          <input
            type="number"
            id="body-fat"
            min="1"
            max="100"
            step="0.1"
            placeholder="Body fat (%)"
            value={formData.bodyFat}
            onChange={(e) => updateField("bodyFat", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lean-body-mass">Lean Body Mass (optional):</label>
          <input
            type="number"
            id="lean-body-mass"
            min="1"
            step="0.1"
            placeholder={
              formData.unit === "imperial" ? "LBM (lbs)" : "LBM (kg)"
            }
            value={formData.leanBodyMass}
            onChange={(e) => updateField("leanBodyMass", e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="job-activity">Job Activity:</label>
          <select
            id="job-activity"
            value={formData.jobActivity}
            onChange={(e) => updateField("jobActivity", e.target.value)}
          >
            <option value="1">Sedentary (desk job, work from home)</option>
            <option value="1.2">Lightly active (teacher, host, usher)</option>
            <option value="1.3">
              Moderately active (nurse, trainer, server)
            </option>
            <option value="1.4">
              Very active (construction worker, farmer)
            </option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="weight-lifting-days">
            Weight Lifting (days per week):
          </label>
          <select
            id="weight-lifting-days"
            value={formData.weightLiftingDays}
            onChange={(e) => toggleWeightLiftingDetails(e.target.value)}
          >
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
          </select>
        </div>

        {formData.weightLiftingDays > 0 && (
          <div className="nested-inputs">
            <div className="form-group">
              <label htmlFor="weight-lifting-minutes">
                Minutes per session:
              </label>
              <input
                type="number"
                id="weight-lifting-minutes"
                min="1"
                max="240"
                placeholder="Minutes"
                value={formData.weightLiftingMinutes}
                onChange={(e) =>
                  updateField("weightLiftingMinutes", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="weight-lifting-intensity">Intensity:</label>
              <select
                id="weight-lifting-intensity"
                value={formData.weightLiftingIntensity}
                onChange={(e) =>
                  updateField("weightLiftingIntensity", e.target.value)
                }
              >
                <option value="1.1">Light (can carry a conversation)</option>
                <option value="1.2">Moderate (slightly challenging)</option>
                <option value="1.3">High (challenging)</option>
                <option value="1.4">Very High (extremely challenging)</option>
              </select>
            </div>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="cardio-days">Cardio (days per week):</label>
          <select
            id="cardio-days"
            value={formData.cardioDays}
            onChange={(e) => toggleCardioDetails(e.target.value)}
          >
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
          </select>
        </div>

        {formData.cardioDays > 0 && (
          <div className="nested-inputs">
            <div className="form-group">
              <label htmlFor="cardio-minutes">Minutes per session:</label>
              <input
                type="number"
                id="cardio-minutes"
                min="1"
                max="240"
                placeholder="Minutes"
                value={formData.cardioMinutes}
                onChange={(e) => updateField("cardioMinutes", e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cardio-intensity">Intensity:</label>
              <select
                id="cardio-intensity"
                value={formData.cardioIntensity}
                onChange={(e) => updateField("cardioIntensity", e.target.value)}
              >
                <option value="1.1">Light (can carry a conversation)</option>
                <option value="1.2">Moderate (slightly challenging)</option>
                <option value="1.3">High (challenging)</option>
                <option value="1.4">Very High (extremely challenging)</option>
              </select>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={calculateMacros}
          className="calculate-button"
        >
          Calculate
        </button>
      </div>

      {showOutput && (
        <div id="output" className="output-container">
          <h2>
            Macronutrients for <span className="highlight">{output.goal}</span>
          </h2>
          <div className="macro-result">
            <p>
              Calories: <span className="highlight">{output.calories}</span>
            </p>
          </div>
          <div className="macro-result">
            <p>
              Protein: <span className="highlight">{output.protein}</span>g (
              <span className="highlight">{output.proteinCalories}</span>{" "}
              calories)
            </p>
          </div>
          <div className="macro-result">
            <p>
              Carbohydrates: <span className="highlight">{output.carbs}</span>g
              (<span className="highlight">{output.carbsCalories}</span>{" "}
              calories)
            </p>
          </div>
          <div className="macro-result">
            <p>
              Fat: <span className="highlight">{output.fat}</span>g (
              <span className="highlight">{output.fatCalories}</span> calories)
            </p>
          </div>

          <div className="macro-chart">
            <div
              className="chart-bar protein"
              style={{
                width: `${(output.proteinCalories / output.calories) * 100}%`,
              }}
            >
              Protein (
              {Math.round((output.proteinCalories / output.calories) * 100)}%)
            </div>
            <div
              className="chart-bar carbs"
              style={{
                width: `${(output.carbsCalories / output.calories) * 100}%`,
              }}
            >
              Carbs (
              {Math.round((output.carbsCalories / output.calories) * 100)}%)
            </div>
            <div
              className="chart-bar fat"
              style={{
                width: `${(output.fatCalories / output.calories) * 100}%`,
              }}
            >
              Fat ({Math.round((output.fatCalories / output.calories) * 100)}%)
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
