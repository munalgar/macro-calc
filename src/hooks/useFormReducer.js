import { useReducer } from "react";

// Initial state for form values
export const initialState = {
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

export default function useFormReducer() {
  const [formData, dispatch] = useReducer(formReducer, initialState);

  // Helper functions to simplify form management
  const updateField = (field, value) => {
    dispatch({ type: "UPDATE_FIELD", field, value });
  };

  const toggleWeightLiftingDetails = (days) => {
    dispatch({ type: "RESET_WEIGHT_LIFTING", days });
  };

  const toggleCardioDetails = (days) => {
    dispatch({ type: "RESET_CARDIO", days });
  };

  const resetForm = () => {
    dispatch({ type: "RESET_FORM" });
  };

  return {
    formData,
    updateField,
    toggleWeightLiftingDetails,
    toggleCardioDetails,
    resetForm,
  };
}
