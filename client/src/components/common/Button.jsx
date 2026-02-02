import React from "react";

const BUTTON_STYLES = {
  primary: "bg-purple-500 hover:bg-purple-600 text-white",
  secondary: "bg-gray-500 hover:bg-gray-600 text-white",
  info: "bg-blue-500 hover:bg-blue-600 text-white",
  warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
  editing: "bg-green-500 hover:bg-green-600 text-white",
  deleting: "bg-red-500 hover:bg-red-600 text-white",
};

const Button = ({ type = "primary", disabled = false, children, onClick }) => {
  const buttonClass = `
    px-4 py-2 rounded-lg transition duration-300 
    ${BUTTON_STYLES[type]} 
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
  `;

  return (
    <button className={`flex items-center justify-between gap-2 ${buttonClass}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
