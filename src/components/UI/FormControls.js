import React from "react";

export const FormGroup = ({ children, className = "" }) => {
  return <div className={`form-group ${className}`}>{children}</div>;
};

export const FormLabel = ({ htmlFor, children, required }) => {
  return (
    <label htmlFor={htmlFor}>
      {children}
      {required && <span className="required-indicator">*</span>}
    </label>
  );
};

export const FormInput = ({
  id,
  type = "text",
  min,
  max,
  step,
  placeholder,
  value,
  onChange,
  error,
  required,
  className = "",
}) => {
  return (
    <>
      <input
        id={id}
        type={type}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={error ? "true" : "false"}
        className={className}
      />
      {error && <span className="error-message">{error}</span>}
    </>
  );
};

export const FormSelect = ({
  id,
  value,
  onChange,
  children,
  error,
  required,
  className = "",
}) => {
  return (
    <>
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        aria-invalid={error ? "true" : "false"}
        className={className}
      >
        {children}
      </select>
      {error && <span className="error-message">{error}</span>}
    </>
  );
};

export const UnitToggle = ({ unit, onChange }) => {
  return (
    <div
      className="unit-toggle"
      role="radiogroup"
      aria-label="Measurement units"
    >
      <button
        type="button"
        onClick={() => onChange("imperial")}
        className={unit === "imperial" ? "selected" : ""}
        aria-pressed={unit === "imperial"}
      >
        Imperial
      </button>
      <button
        type="button"
        onClick={() => onChange("metric")}
        className={unit === "metric" ? "selected" : ""}
        aria-pressed={unit === "metric"}
      >
        Metric
      </button>
    </div>
  );
};

export const FormHelperText = ({ children }) => {
  return <span className="form-helper-text">{children}</span>;
};
