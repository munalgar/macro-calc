// Form validation
export const validateForm = (formData) => {
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

  return newErrors;
};
