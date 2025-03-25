"use client";
import { useState, useEffect } from "react";
import "./globals.css";
export default function MacroCalculator() {
  // State for form values
  const [sex, setSex] = useState("male");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("maintain");
  const [bodyFat, setBodyFat] = useState("");
  const [leanBodyMass, setLeanBodyMass] = useState("");
  const [jobActivity, setJobActivity] = useState("1");
  const [unit, setUnit] = useState("metric");
  const [weightLiftingDays, setWeightLiftingDays] = useState("0");
  const [weightLiftingMinutes, setWeightLiftingMinutes] = useState("");
  const [weightLiftingIntensity, setWeightLiftingIntensity] = useState("1.1");
  const [cardioDays, setCardioDays] = useState("0");
  const [cardioMinutes, setCardioMinutes] = useState("");
  const [cardioIntensity, setCardioIntensity] = useState("1.1"); // State for calculation results
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
  }); // Handle unit change
  const updatePlaceholders = (newUnit) => {
    setUnit(newUnit);
  }; // Toggle weight lifting details
  const toggleWeightLiftingDetails = (days) => {
    setWeightLiftingDays(days);
    if (days === "0") {
      setWeightLiftingMinutes("");
      setWeightLiftingIntensity("1.1");
    }
  }; // Toggle cardio details
  const toggleCardioDetails = (days) => {
    setCardioDays(days);
    if (days === "0") {
      setCardioMinutes("");
      setCardioIntensity("1.1");
    }
  }; // Calculate macros function
  const calculateMacros = () => {
    // Validation for required fields
    if (!sex || !age || !height || !weight) {
      alert("Please fill in all required fields: sex, age, height, and weight");
      return;
    }

    if (weightLiftingDays > 0 && !weightLiftingMinutes) {
      alert("Please fill in weight lifting minutes");
      return;
    }

    if (cardioDays > 0 && !cardioMinutes) {
      alert("Please fill in cardio minutes");
      return;
    }

    const caloriesPerGram = {
      protein: 4,
      carbs: 4,
      fat: 9,
    };

    const weightLiftingCaloriesPerDay =
      weightLiftingDays > 0
        ? (parseInt(weightLiftingMinutes) * 3 * parseInt(weightLiftingDays)) / 7
        : 0;

    const cardioCaloriesPerDay =
      cardioDays > 0
        ? (parseInt(cardioMinutes) * 5 * parseInt(cardioDays)) / 7
        : 0;

    let heightInCm, weightInKg;
    if (unit === "imperial") {
      heightInCm = parseFloat(height) * 2.54;
      weightInKg = parseFloat(weight) * 0.453592;
    } else {
      heightInCm = parseFloat(height);
      weightInKg = parseFloat(weight);
    }

    // Calculate BMR
    let BMR;
    if (sex === "male") {
      BMR =
        88.362 +
        13.397 * weightInKg +
        4.799 * heightInCm -
        5.677 * parseInt(age);
    } else {
      BMR =
        447.593 +
        9.247 * weightInKg +
        3.098 * heightInCm -
        4.33 * parseInt(age);
    }

    // Calculate Lean Body Mass
    let LBM = parseFloat(leanBodyMass);
    const BF = parseFloat(bodyFat);

    if (!isNaN(LBM)) {
      // Use user-provided LBM
    } else if (!isNaN(BF)) {
      // Calculate LBM from body fat
      LBM = (1 - BF / 100) * weightInKg;
    } else {
      // Default estimates
      LBM = sex === "male" ? (1 - 0.12) * weightInKg : (1 - 0.25) * weightInKg;
    }

    // Activity multipliers
    const jobActivityMultiplier = parseFloat(jobActivity) + 0.2;
    const weightLiftingMultiplier =
      parseInt(weightLiftingDays) > 0
        ? parseFloat(weightLiftingIntensity) + 0.2
        : 1.0;
    const cardioMultiplier =
      parseInt(cardioDays) > 0 ? parseFloat(cardioIntensity) + 0.2 : 1.0;

    // Calculate weighted activity multiplier
    const weightedActivityMultiplier =
      0.2 * jobActivityMultiplier +
      0.35 * weightLiftingMultiplier +
      0.45 * cardioMultiplier;

    let calories =
      BMR * weightedActivityMultiplier +
      weightLiftingCaloriesPerDay +
      cardioCaloriesPerDay;

    // Adjust calories based on goal
    if (goal === "gain") {
      calories += 500; // add 500 calories for weight gain
    } else if (goal === "lose") {
      calories -= 500; // subtract 500 calories for weight loss
    }

    // Calculate macros
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

    // Update goal text
    let goalText;
    switch (goal) {
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
              className={unit === "imperial" ? "selected" : ""}
              aria-pressed={unit === "imperial"}
            >
              Imperial
            </button>
            <button
              onClick={() => updatePlaceholders("metric")}
              className={unit === "metric" ? "selected" : ""}
              aria-pressed={unit === "metric"}
            >
              Metric
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="sex">Sex:</label>
          <select id="sex" value={sex} onChange={(e) => setSex(e.target.value)}>
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
            value={age}
            onChange={(e) => setAge(e.target.value)}
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
              unit === "imperial" ? "Height (inches)" : "Height (cm)"
            }
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="weight">Weight:</label>
          <input
            type="number"
            id="weight"
            min="1"
            step="0.01"
            placeholder={unit === "imperial" ? "Weight (lbs)" : "Weight (kg)"}
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="goal">Goal:</label>
          <select
            id="goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
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
            value={bodyFat}
            onChange={(e) => setBodyFat(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lean-body-mass">Lean Body Mass (optional):</label>
          <input
            type="number"
            id="lean-body-mass"
            min="1"
            step="0.1"
            placeholder={unit === "imperial" ? "LBM (lbs)" : "LBM (kg)"}
            value={leanBodyMass}
            onChange={(e) => setLeanBodyMass(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="job-activity">Job Activity:</label>
          <select
            id="job-activity"
            value={jobActivity}
            onChange={(e) => setJobActivity(e.target.value)}
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
            value={weightLiftingDays}
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

        {weightLiftingDays > 0 && (
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
                value={weightLiftingMinutes}
                onChange={(e) => setWeightLiftingMinutes(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="weight-lifting-intensity">Intensity:</label>
              <select
                id="weight-lifting-intensity"
                value={weightLiftingIntensity}
                onChange={(e) => setWeightLiftingIntensity(e.target.value)}
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
            value={cardioDays}
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

        {cardioDays > 0 && (
          <div className="nested-inputs">
            <div className="form-group">
              <label htmlFor="cardio-minutes">Minutes per session:</label>
              <input
                type="number"
                id="cardio-minutes"
                min="1"
                max="240"
                placeholder="Minutes"
                value={cardioMinutes}
                onChange={(e) => setCardioMinutes(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cardio-intensity">Intensity:</label>
              <select
                id="cardio-intensity"
                value={cardioIntensity}
                onChange={(e) => setCardioIntensity(e.target.value)}
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
