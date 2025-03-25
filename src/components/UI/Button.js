import React from "react";

const Button = ({
  children,
  onClick,
  className = "",
  variant = "primary",
  size = "medium",
  type = "button",
}) => {
  const baseClass = "button";
  const variantClass = `button-${variant}`;
  const sizeClass = `button-${size}`;

  const combinedClasses = `${baseClass} ${variantClass} ${sizeClass} ${className}`;

  return (
    <button type={type} onClick={onClick} className={combinedClasses}>
      {children}
    </button>
  );
};

export default Button;
