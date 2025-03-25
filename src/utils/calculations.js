// Unit conversion functions
export const convertToMetric = (height, weight, unit) => {
  let heightInCm, weightInKg;
  if (unit === "imperial") {
    heightInCm = parseFloat(height) * 2.54;
    weightInKg = parseFloat(weight) * 0.453592;
  } else {
    heightInCm = parseFloat(height);
    weightInKg = parseFloat(weight);
  }
  return { heightInCm, weightInKg };
};

// BMR calculation using Mifflin-St Jeor equation
export const calculateBMR = (age, sex, heightInCm, weightInKg) => {
  if (!age || !heightInCm || !weightInKg) {
    return 0;
  }

  if (sex === "male") {
    return (
      88.362 + 13.397 * weightInKg + 4.799 * heightInCm - 5.677 * parseInt(age)
    );
  } else {
    return (
      447.593 + 9.247 * weightInKg + 3.098 * heightInCm - 4.33 * parseInt(age)
    );
  }
};

// Calculate Lean Body Mass
export const calculateLBM = (weightInKg, formData) => {
  if (!weightInKg) return 0;

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
};

// Calculate BMI
export const calculateBMI = (heightInCm, weightInKg) => {
  if (!heightInCm || !weightInKg) {
    return { bmi: 0, category: "" };
  }

  const heightInMeters = heightInCm / 100;
  const bmi = weightInKg / (heightInMeters * heightInMeters);

  let category;
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal weight";
  else if (bmi < 30) category = "Overweight";
  else category = "Obese";

  return { bmi, category };
};

// Calculate exercise calories
export const calculateExerciseCalories = (formData) => {
  const weightLiftingCaloriesPerDay =
    formData.weightLiftingDays > 0
      ? (parseInt(formData.weightLiftingMinutes) *
          (3.5 + (parseFloat(formData.weightLiftingIntensity) - 1) * 3) *
          parseInt(formData.weightLiftingDays)) /
        7
      : 0;

  const cardioCaloriesPerDay =
    formData.cardioDays > 0
      ? (parseInt(formData.cardioMinutes) *
          (5 + (parseFloat(formData.cardioIntensity) - 1) * 5) *
          parseInt(formData.cardioDays)) /
        7
      : 0;

  return { weightLiftingCaloriesPerDay, cardioCaloriesPerDay };
};

// Calculate activity multiplier
export const calculateActivityMultiplier = (formData) => {
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

  // Weighted activity multiplier
  return (
    0.65 * jobActivityMultiplier +
    0.2 * weightLiftingMultiplier +
    0.15 * cardioMultiplier
  );
};

// Calculate macros based on TDEE, goal and preferences
export const calculateMacros = (
  tdee,
  LBM,
  weightInKg,
  goal,
  proteinPreference
) => {
  // Calories per gram of each macronutrient
  const caloriesPerGram = {
    protein: 4,
    carbs: 4,
    fat: 9,
  };

  // Adjust calories based on goal
  let calories;
  if (goal === "gain") {
    calories = tdee * 1.15; // 15% surplus for muscle gain
  } else if (goal === "lose") {
    calories = Math.max(tdee * 0.8, 1200); // 20% deficit with safety floor
  } else {
    calories = tdee; // Maintenance
  }

  // Goal-specific protein recommendations
  let proteinFactor;
  if (goal === "lose") {
    proteinFactor = 2.4; // Higher protein for cutting to preserve muscle
  } else if (goal === "gain") {
    proteinFactor = 1.8; // Moderate protein for bulking
  } else {
    proteinFactor = 2.0; // Balanced for maintenance
  }

  // Adjust protein based on user preference
  switch (proteinPreference) {
    case "low":
      proteinFactor *= 0.8;
      break;
    case "high":
      proteinFactor *= 1.2;
      break;
  }

  // Calculate macros
  let protein = LBM * proteinFactor;
  let proteinCalories = protein * caloriesPerGram.protein;

  // Fat calculation based on body weight (with minimum to support hormones)
  let fat = Math.max(weightInKg * 0.8, (calories * 0.25) / caloriesPerGram.fat);
  let fatCalories = fat * caloriesPerGram.fat;

  // Carbs fill in the remaining calories
  let carbs =
    (calories - proteinCalories - fatCalories) / caloriesPerGram.carbs;
  let carbsCalories = carbs * caloriesPerGram.carbs;

  // Goal text
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

  return {
    goal: goalText,
    calories: Math.round(calories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    proteinCalories: Math.round(proteinCalories),
    carbsCalories: Math.round(carbsCalories),
    fatCalories: Math.round(fatCalories),
    tdee: Math.round(tdee),
  };
};
