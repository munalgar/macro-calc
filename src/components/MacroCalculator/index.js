import React, { useState, useMemo } from "react";
import useFormReducer from "../../hooks/useFormReducer";
import { validateForm } from "../../utils/validation";
import {
  convertToMetric,
  calculateBMR,
  calculateLBM,
  calculateExerciseCalories,
  calculateActivityMultiplier,
  calculateMacros as calcMacros,
} from "../../utils/calculations";
import MacroForm from "./MacroForm";
import MacroOutput from "./MacroOutput";

const MacroCalculator = () => {
  // Form state from custom hook
  const {
    formData,
    updateField,
    toggleWeightLiftingDetails,
    toggleCardioDetails,
    resetForm: resetFormData,
  } = useFormReducer();

  // Form validation errors state
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
    tdee: 0,
  });

  // Handle field update with validation clearing
  const handleUpdateField = (field, value) => {
    updateField(field, value);

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
  const updateUnit = (newUnit) => {
    updateField("unit", newUnit);
  };

  // Reset form completely
  const resetForm = () => {
    resetFormData();
    setErrors({});
    setShowOutput(false);
  };

  // Memoized conversion values
  const conversionValues = useMemo(() => {
    if (!formData.height || !formData.weight) {
      return { heightInCm: 0, weightInKg: 0 };
    }
    return convertToMetric(formData.height, formData.weight, formData.unit);
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
    return calculateBMR(
      formData.age,
      formData.sex,
      conversionValues.heightInCm,
      conversionValues.weightInKg
    );
  }, [formData.age, formData.sex, conversionValues]);

  // Memoized LBM calculation
  const calculatedLBM = useMemo(() => {
    if (!conversionValues.weightInKg) return 0;
    return calculateLBM(conversionValues.weightInKg, formData);
  }, [formData, conversionValues.weightInKg]);

  // Calculate macros function
  const calculateMacros = () => {
    // Validate form before calculation
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Scroll to first error
      const firstErrorId = Object.keys(validationErrors)[0];
      if (firstErrorId) {
        document
          .getElementById(firstErrorId)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Get exercise calories
    const { weightLiftingCaloriesPerDay, cardioCaloriesPerDay } =
      calculateExerciseCalories(formData);

    // Get activity multiplier
    const weightedActivityMultiplier = calculateActivityMultiplier(formData);

    // Calculate TDEE
    const tdee =
      calculatedBMR * weightedActivityMultiplier +
      weightLiftingCaloriesPerDay +
      cardioCaloriesPerDay;

    // Calculate macros based on TDEE
    const macroResults = calcMacros(
      tdee,
      calculatedLBM,
      conversionValues.weightInKg,
      formData.goal,
      formData.proteinPreference
    );

    // Update output with calculated values
    setOutput(macroResults);
    setShowOutput(true);
  };

  return (
    <main className="container">
      <header className="app-header">
        <h1>🧮 Macro Calculator</h1>
        <p className="app-description">
          Calculate your personalized macro nutrition plan based on your body
          metrics and activity level ✨
        </p>
      </header>

      <MacroForm
        formData={formData}
        errors={errors}
        updateField={handleUpdateField}
        updateUnit={updateUnit}
        toggleWeightLiftingDetails={toggleWeightLiftingDetails}
        toggleCardioDetails={toggleCardioDetails}
        calculateMacros={calculateMacros}
        resetForm={resetForm}
      />

      {showOutput && <MacroOutput output={output} />}
    </main>
  );
};

export default MacroCalculator;
