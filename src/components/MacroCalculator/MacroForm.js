import React from "react";
import Button from "../UI/Button";
import {
  FormGroup,
  FormLabel,
  FormInput,
  FormSelect,
  UnitToggle,
  FormHelperText,
} from "../UI/FormControls";

const MacroForm = ({
  formData,
  errors,
  updateField,
  updateUnit,
  toggleWeightLiftingDetails,
  toggleCardioDetails,
  calculateMacros,
  resetForm,
}) => {
  return (
    <div className="calculator-container">
      {/* Unit Selection Section */}
      <div className="form-section">
        <h2 className="form-section-title">📏 Measurement System</h2>
        <FormGroup>
          <UnitToggle unit={formData.unit} onChange={updateUnit} />
        </FormGroup>
      </div>

      {/* Personal Details Section */}
      <div className="form-section">
        <h2 className="form-section-title">👤 Personal Details</h2>

        <div className="form-row">
          <FormGroup>
            <FormLabel htmlFor="sex" required>
              👫 Sex
            </FormLabel>
            <FormSelect
              id="sex"
              value={formData.sex}
              onChange={(e) => updateField("sex", e.target.value)}
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="age" required>
              🎂 Age
            </FormLabel>
            <FormInput
              type="number"
              id="age"
              min="18"
              max="120"
              placeholder="Age (years)"
              value={formData.age}
              onChange={(e) => updateField("age", e.target.value)}
              error={errors.age}
              required
            />
          </FormGroup>
        </div>

        <div className="form-row">
          <FormGroup>
            <FormLabel htmlFor="height" required>
              📏 Height
            </FormLabel>
            <FormInput
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
              error={errors.height}
              required
            />
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="weight" required>
              ⚖️ Weight
            </FormLabel>
            <FormInput
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
              error={errors.weight}
              required
            />
          </FormGroup>
        </div>

        <div className="form-row">
          <FormGroup>
            <FormLabel htmlFor="body-fat">📊 Body Fat % (optional)</FormLabel>
            <FormInput
              type="number"
              id="body-fat"
              min="1"
              max="70"
              step="0.1"
              placeholder="Body fat (%)"
              value={formData.bodyFat}
              onChange={(e) => updateField("bodyFat", e.target.value)}
              error={errors.bodyFat}
            />
            <FormHelperText>Helps provide more accurate results</FormHelperText>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="lean-body-mass">
              💪 Lean Body Mass (optional)
            </FormLabel>
            <FormInput
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
              error={errors.leanBodyMass}
            />
            <FormHelperText>
              If you know your LBM, otherwise we&apos;ll estimate it
            </FormHelperText>
          </FormGroup>
        </div>
      </div>

      {/* Goal and Activity Section */}
      <div className="form-section">
        <h2 className="form-section-title">🎯 Goal & Daily Activity</h2>

        <div className="form-row">
          <FormGroup>
            <FormLabel htmlFor="goal" required>
              🎯 Fitness Goal
            </FormLabel>
            <FormSelect
              id="goal"
              value={formData.goal}
              onChange={(e) => updateField("goal", e.target.value)}
              required
            >
              <option value="maintain">⚖️ Maintain weight</option>
              <option value="gain">⬆️ Gain weight</option>
              <option value="lose">⬇️ Lose weight</option>
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <FormLabel htmlFor="job-activity" required>
              🏢 Daily Job Activity
            </FormLabel>
            <FormSelect
              id="job-activity"
              value={formData.jobActivity}
              onChange={(e) => updateField("jobActivity", e.target.value)}
              required
            >
              <option value="1">Sedentary (desk job, work from home)</option>
              <option value="1.2">Lightly active (teacher, host, usher)</option>
              <option value="1.3">
                Moderately active (nurse, trainer, server)
              </option>
              <option value="1.4">
                Very active (construction worker, farmer)
              </option>
            </FormSelect>
          </FormGroup>
        </div>
      </div>

      {/* Exercise Activity Section */}
      <div className="form-section">
        <h2 className="form-section-title">💪 Exercise Activity</h2>

        <div className="activity-card">
          <h3>🏋️ Weight Training</h3>
          <FormGroup>
            <FormLabel htmlFor="weight-lifting-days">
              📅 Days per week
            </FormLabel>
            <FormSelect
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
            </FormSelect>
          </FormGroup>

          {formData.weightLiftingDays > 0 && (
            <div className="nested-inputs">
              <div className="form-row">
                <FormGroup>
                  <FormLabel htmlFor="weight-lifting-minutes">
                    ⏱️ Minutes per session
                  </FormLabel>
                  <FormInput
                    type="number"
                    id="weight-lifting-minutes"
                    min="1"
                    max="240"
                    placeholder="Minutes"
                    value={formData.weightLiftingMinutes}
                    onChange={(e) =>
                      updateField("weightLiftingMinutes", e.target.value)
                    }
                    error={errors.weightLiftingMinutes}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="weight-lifting-intensity">
                    🔥 Intensity
                  </FormLabel>
                  <FormSelect
                    id="weight-lifting-intensity"
                    value={formData.weightLiftingIntensity}
                    onChange={(e) =>
                      updateField("weightLiftingIntensity", e.target.value)
                    }
                  >
                    <option value="1.1">
                      Light (can carry a conversation)
                    </option>
                    <option value="1.2">Moderate (slightly challenging)</option>
                    <option value="1.3">High (challenging)</option>
                    <option value="1.4">
                      Very High (extremely challenging)
                    </option>
                  </FormSelect>
                </FormGroup>
              </div>
            </div>
          )}
        </div>

        <div className="activity-card">
          <h3>🏃 Cardiovascular Exercise</h3>
          <FormGroup>
            <FormLabel htmlFor="cardio-days">📅 Days per week</FormLabel>
            <FormSelect
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
            </FormSelect>
          </FormGroup>

          {formData.cardioDays > 0 && (
            <div className="nested-inputs">
              <div className="form-row">
                <FormGroup>
                  <FormLabel htmlFor="cardio-minutes">
                    ⏱️ Minutes per session
                  </FormLabel>
                  <FormInput
                    type="number"
                    id="cardio-minutes"
                    min="1"
                    max="240"
                    placeholder="Minutes"
                    value={formData.cardioMinutes}
                    onChange={(e) =>
                      updateField("cardioMinutes", e.target.value)
                    }
                    error={errors.cardioMinutes}
                  />
                </FormGroup>

                <FormGroup>
                  <FormLabel htmlFor="cardio-intensity">🔥 Intensity</FormLabel>
                  <FormSelect
                    id="cardio-intensity"
                    value={formData.cardioIntensity}
                    onChange={(e) =>
                      updateField("cardioIntensity", e.target.value)
                    }
                  >
                    <option value="1.1">
                      Light (can carry a conversation)
                    </option>
                    <option value="1.2">Moderate (slightly challenging)</option>
                    <option value="1.3">High (challenging)</option>
                    <option value="1.4">
                      Very High (extremely challenging)
                    </option>
                  </FormSelect>
                </FormGroup>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Diet Preferences Section */}
      <div className="form-section">
        <h2 className="form-section-title">🍽️ Diet Preferences</h2>

        <FormGroup>
          <FormLabel htmlFor="protein-preference">
            🥩 Protein Preference
          </FormLabel>
          <FormSelect
            id="protein-preference"
            value={formData.proteinPreference}
            onChange={(e) => updateField("proteinPreference", e.target.value)}
          >
            <option value="low">🌱 Lower Protein (plant-based diets)</option>
            <option value="moderate">
              ⚖️ Moderate Protein (balanced diets)
            </option>
            <option value="high">
              💪 Higher Protein (athletic performance)
            </option>
          </FormSelect>
        </FormGroup>
      </div>

      {/* Action Buttons */}
      <div className="button-group">
        <Button
          onClick={calculateMacros}
          className="calculate-button"
          variant="primary"
          size="medium"
        >
          🧮 Calculate Macros
        </Button>
        <Button
          onClick={resetForm}
          className="reset-button"
          variant="secondary"
          size="medium"
        >
          🔄 Reset
        </Button>
      </div>
    </div>
  );
};

export default MacroForm;
