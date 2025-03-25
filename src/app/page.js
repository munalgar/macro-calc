"use client";

import { useState, useReducer, useMemo } from "react";
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
  proteinPreference: "moderate",
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
    case "RESET_FORM":
      return { ...initialState };
    default:
      return state;
  }
}

export default function MacroCalculator() {
  // Use reducer for form state management
  const [formData, dispatch] = useReducer(formReducer, initialState);
  // Add form validation errors state
  const [errors, setErrors] = useState({});

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

  // Update field handler with validation
  const updateField = (field, value) => {
    dispatch({ type: "UPDATE_FIELD", field, value });

    // Clear error for this field when user makes changes
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle unit change
  const updatePlaceholders = (newUnit) => {
    updateField("unit", newUnit);
  };

  // Toggle weight lifting details
  const toggleWeightLiftingDetails = (days) => {
    dispatch({ type: "RESET_WEIGHT_LIFTING", days });
    // Clear related errors
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.weightLiftingMinutes;
      return newErrors;
    });
  };

  // Toggle cardio details
  const toggleCardioDetails = (days) => {
    dispatch({ type: "RESET_CARDIO", days });
    // Clear related errors
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.cardioMinutes;
      return newErrors;
    });
  };

  // Reset form
  const resetForm = () => {
    dispatch({ type: "RESET_FORM" });
    setErrors({});
    setShowOutput(false);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.age) newErrors.age = "Age is required";
    else if (formData.age < 18 || formData.age > 120)
      newErrors.age = "Age must be between 18 and 120";

    if (!formData.height) newErrors.height = "Height is required";
    else if (
      formData.unit === "metric" &&
      (formData.height < 50 || formData.height > 250)
    )
      newErrors.height = "Height must be between 50cm and 250cm";
    else if (
      formData.unit === "imperial" &&
      (formData.height < 20 || formData.height > 100)
    )
      newErrors.height = "Height must be between 20in and 100in";

    if (!formData.weight) newErrors.weight = "Weight is required";
    else if (
      formData.unit === "metric" &&
      (formData.weight < 30 || formData.weight > 300)
    )
      newErrors.weight = "Weight must be between 30kg and 300kg";
    else if (
      formData.unit === "imperial" &&
      (formData.weight < 60 || formData.weight > 660)
    )
      newErrors.weight = "Weight must be between 60lbs and 660lbs";

    // Conditional fields
    if (formData.weightLiftingDays > 0 && !formData.weightLiftingMinutes)
      newErrors.weightLiftingMinutes = "Minutes per session is required";
    else if (
      formData.weightLiftingDays > 0 &&
      (formData.weightLiftingMinutes < 1 || formData.weightLiftingMinutes > 240)
    )
      newErrors.weightLiftingMinutes = "Minutes must be between 1 and 240";

    if (formData.cardioDays > 0 && !formData.cardioMinutes)
      newErrors.cardioMinutes = "Minutes per session is required";
    else if (
      formData.cardioDays > 0 &&
      (formData.cardioMinutes < 1 || formData.cardioMinutes > 240)
    )
      newErrors.cardioMinutes = "Minutes must be between 1 and 240";

    // Optional fields with constraints
    if (formData.bodyFat && (formData.bodyFat < 1 || formData.bodyFat > 70))
      newErrors.bodyFat = "Body fat must be between 1% and 70%";

    if (formData.leanBodyMass) {
      if (
        formData.unit === "metric" &&
        (formData.leanBodyMass < 20 || formData.leanBodyMass > 200)
      )
        newErrors.leanBodyMass = "LBM must be between 20kg and 200kg";
      else if (
        formData.unit === "imperial" &&
        (formData.leanBodyMass < 44 || formData.leanBodyMass > 440)
      )
        newErrors.leanBodyMass = "LBM must be between 44lbs and 440lbs";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Memoized conversion values
  const conversionValues = useMemo(() => {
    if (!formData.height || !formData.weight) {
      return { heightInCm: 0, weightInKg: 0 };
    }

    let heightInCm, weightInKg;
    if (formData.unit === "imperial") {
      heightInCm = parseFloat(formData.height) * 2.54;
      weightInKg = parseFloat(formData.weight) * 0.453592;
    } else {
      heightInCm = parseFloat(formData.height);
      weightInKg = parseFloat(formData.weight);
    }
    return { heightInCm, weightInKg };
  }, [formData.height, formData.weight, formData.unit]);

  // Memoized BMR calculation
  const calculatedBMR = useMemo(() => {
    if (
      !formData.age ||
      !conversionValues.heightInCm ||
      !conversionValues.weightInKg
    ) {
      return 0;
    }

    const { heightInCm, weightInKg } = conversionValues;
    if (formData.sex === "male") {
      return (
        88.362 +
        13.397 * weightInKg +
        4.799 * heightInCm -
        5.677 * parseInt(formData.age)
      );
    } else {
      return (
        447.593 +
        9.247 * weightInKg +
        3.098 * heightInCm -
        4.33 * parseInt(formData.age)
      );
    }
  }, [formData.age, formData.sex, conversionValues]);

  // Memoized LBM calculation
  const calculatedLBM = useMemo(() => {
    if (!conversionValues.weightInKg) return 0;

    const { weightInKg } = conversionValues;
    const LBM = parseFloat(formData.leanBodyMass);
    const BF = parseFloat(formData.bodyFat);

    if (!isNaN(LBM)) {
      // User-provided LBM
      return formData.unit === "imperial" ? LBM * 0.453592 : LBM;
    } else if (!isNaN(BF)) {
      // Calculate LBM from body fat
      return (1 - BF / 100) * weightInKg;
    } else {
      // Default estimates based on typical body fat percentages
      return formData.sex === "male"
        ? (1 - 0.15) * weightInKg // 15% average for males
        : (1 - 0.25) * weightInKg; // 25% average for females
    }
  }, [
    formData.leanBodyMass,
    formData.bodyFat,
    formData.sex,
    formData.unit,
    conversionValues,
  ]);

  // Memoized BMI calculation
  const calculatedBMI = useMemo(() => {
    if (!conversionValues.heightInCm || !conversionValues.weightInKg) {
      return { bmi: 0, category: "" };
    }

    const { heightInCm, weightInKg } = conversionValues;
    const heightInMeters = heightInCm / 100;
    const bmi = weightInKg / (heightInMeters * heightInMeters);

    let category;
    if (bmi < 18.5) category = "Underweight";
    else if (bmi < 25) category = "Normal weight";
    else if (bmi < 30) category = "Overweight";
    else category = "Obese";

    return { bmi, category };
  }, [conversionValues]);

  // Calculate macros function
  const calculateMacros = () => {
    // Validate form before calculation
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorId = Object.keys(errors)[0];
      if (firstErrorId) {
        document
          .getElementById(firstErrorId)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const caloriesPerGram = {
      protein: 4,
      carbs: 4,
      fat: 9,
    };

    // Use the memoized calculations
    const { weightInKg } = conversionValues;
    const BMR = calculatedBMR;
    const LBM = calculatedLBM;

    // Exercise calorie calculations - more accurate energy expenditure
    const weightLiftingCaloriesPerDay =
      formData.weightLiftingDays > 0
        ? (parseInt(formData.weightLiftingMinutes) *
            (3.5 + (parseFloat(formData.weightLiftingIntensity) - 1) * 3) * // Adjusts based on intensity
            parseInt(formData.weightLiftingDays)) /
          7
        : 0;

    const cardioCaloriesPerDay =
      formData.cardioDays > 0
        ? (parseInt(formData.cardioMinutes) *
            (5 + (parseFloat(formData.cardioIntensity) - 1) * 5) * // Adjusts based on intensity
            parseInt(formData.cardioDays)) /
          7
        : 0;

    // Improved activity multiplier weightings based on research
    const jobActivityMultiplier = parseFloat(formData.jobActivity);
    const weightLiftingMultiplier =
      parseInt(formData.weightLiftingDays) > 0
        ? 1 +
          (parseFloat(formData.weightLiftingIntensity) - 1) *
            0.05 *
            parseInt(formData.weightLiftingDays)
        : 1.0;
    const cardioMultiplier =
      parseInt(formData.cardioDays) > 0
        ? 1 +
          (parseFloat(formData.cardioIntensity) - 1) *
            0.07 *
            parseInt(formData.cardioDays)
        : 1.0;

    // More scientifically accurate weighting
    const weightedActivityMultiplier =
      0.65 * jobActivityMultiplier +
      0.2 * weightLiftingMultiplier +
      0.15 * cardioMultiplier;

    // Base TDEE calculation
    let tdee =
      BMR * weightedActivityMultiplier +
      weightLiftingCaloriesPerDay +
      cardioCaloriesPerDay;

    // Adjust calories based on goal using percentage rather than fixed value
    let calories;
    if (formData.goal === "gain") {
      calories = tdee * 1.15; // 15% surplus for muscle gain
    } else if (formData.goal === "lose") {
      calories = Math.max(tdee * 0.8, 1200); // 20% deficit with safety floor
    } else {
      calories = tdee; // Maintenance
    }

    // Goal-specific protein recommendations
    let proteinFactor;
    if (formData.goal === "lose") {
      proteinFactor = 2.4; // Higher protein for cutting to preserve muscle
    } else if (formData.goal === "gain") {
      proteinFactor = 1.8; // Moderate protein for bulking
    } else {
      proteinFactor = 2.0; // Balanced for maintenance
    }

    // Adjust protein based on user preference
    switch (formData.proteinPreference) {
      case "low":
        proteinFactor *= 0.8;
        break;
      case "high":
        proteinFactor *= 1.2;
        break;
    }

    let protein = LBM * proteinFactor;
    let proteinCalories = protein * caloriesPerGram.protein;

    // Fat calculation based on body weight (with minimum to support hormones)
    let fat = Math.max(
      weightInKg * 0.8,
      (calories * 0.25) / caloriesPerGram.fat
    );
    let fatCalories = fat * caloriesPerGram.fat;

    // Carbs fill in the remaining calories
    let carbs =
      (calories - proteinCalories - fatCalories) / caloriesPerGram.carbs;
    let carbCalories = carbs * caloriesPerGram.carbs;

    // Handle goal text
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

    // Update output with all calculated values
    setOutput({
      goal: goalText,
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
      proteinCalories: Math.round(proteinCalories),
      carbsCalories: Math.round(carbCalories),
      fatCalories: Math.round(fatCalories),
      tdee: Math.round(tdee),
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
            aria-invalid={errors.age ? "true" : "false"}
          />
          {errors.age && <p className="error-message">{errors.age}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="height">Height:</label>
          <input
            type="number"
            id="height"
            min={formData.unit === "imperial" ? "20" : "50"}
            max={formData.unit === "imperial" ? "100" : "250"}
            step="0.01"
            placeholder={
              formData.unit === "imperial" ? "Height (inches)" : "Height (cm)"
            }
            value={formData.height}
            onChange={(e) => updateField("height", e.target.value)}
            aria-invalid={errors.height ? "true" : "false"}
          />
          {errors.height && <p className="error-message">{errors.height}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="weight">Weight:</label>
          <input
            type="number"
            id="weight"
            min={formData.unit === "imperial" ? "60" : "30"}
            max={formData.unit === "imperial" ? "660" : "300"}
            step="0.01"
            placeholder={
              formData.unit === "imperial" ? "Weight (lbs)" : "Weight (kg)"
            }
            value={formData.weight}
            onChange={(e) => updateField("weight", e.target.value)}
            aria-invalid={errors.weight ? "true" : "false"}
          />
          {errors.weight && <p className="error-message">{errors.weight}</p>}
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
            max="70"
            step="0.1"
            placeholder="Body fat (%)"
            value={formData.bodyFat}
            onChange={(e) => updateField("bodyFat", e.target.value)}
            aria-invalid={errors.bodyFat ? "true" : "false"}
          />
          {errors.bodyFat && <p className="error-message">{errors.bodyFat}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="lean-body-mass">Lean Body Mass (optional):</label>
          <input
            type="number"
            id="lean-body-mass"
            min={formData.unit === "imperial" ? "44" : "20"}
            max={formData.unit === "imperial" ? "440" : "200"}
            step="0.1"
            placeholder={
              formData.unit === "imperial" ? "LBM (lbs)" : "LBM (kg)"
            }
            value={formData.leanBodyMass}
            onChange={(e) => updateField("leanBodyMass", e.target.value)}
            aria-invalid={errors.leanBodyMass ? "true" : "false"}
          />
          {errors.leanBodyMass && (
            <p className="error-message">{errors.leanBodyMass}</p>
          )}
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
                aria-invalid={errors.weightLiftingMinutes ? "true" : "false"}
              />
              {errors.weightLiftingMinutes && (
                <p className="error-message">{errors.weightLiftingMinutes}</p>
              )}
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
                aria-invalid={errors.cardioMinutes ? "true" : "false"}
              />
              {errors.cardioMinutes && (
                <p className="error-message">{errors.cardioMinutes}</p>
              )}
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

        <div className="form-group">
          <label htmlFor="protein-preference">Protein Preference:</label>
          <select
            id="protein-preference"
            value={formData.proteinPreference}
            onChange={(e) => updateField("proteinPreference", e.target.value)}
          >
            <option value="low">Lower Protein</option>
            <option value="moderate">Moderate Protein</option>
            <option value="high">Higher Protein</option>
          </select>
        </div>

        <div className="button-group">
          <button
            type="button"
            onClick={calculateMacros}
            className="calculate-button"
          >
            Calculate
          </button>
          <button type="button" onClick={resetForm} className="reset-button">
            Reset
          </button>
        </div>
      </div>

      {showOutput && (
        <div id="output" className="output-container">
          <h2>
            Macronutrients for <span className="highlight">{output.goal}</span>
          </h2>
          <div className="macro-result">
            <p>
              Calories: <span className="highlight">{output.calories}</span>
              <span className="info-text">(TDEE: {output.tdee})</span>
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

          <div className="macro-chart-container">
            <div className="donut-chart-wrapper">
              <div className="donut-chart">
                {/* Full circle segments with z-index to control visibility */}
                <svg viewBox="0 0 100 100" className="donut-svg">
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

                {/* Remove the percentage labels that were here */}
              </div>
            </div>

            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color protein"></span>
                <span className="legend-text">
                  Protein:{" "}
                  {Math.round((output.proteinCalories / output.calories) * 100)}
                  %
                </span>
              </div>
              <div className="legend-item">
                <span className="legend-color carbs"></span>
                <span className="legend-text">
                  Carbs:{" "}
                  {Math.round((output.carbsCalories / output.calories) * 100)}%
                </span>
              </div>
              <div className="legend-item">
                <span className="legend-color fat"></span>
                <span className="legend-text">
                  Fat:{" "}
                  {Math.round((output.fatCalories / output.calories) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
