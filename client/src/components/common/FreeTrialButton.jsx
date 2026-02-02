import React from "react";
import { Link } from "react-router-dom";
import { MdFreeCancellation } from "react-icons/md";

const FreeTrialButton = ({ className = "" }) => {
  return (
    <Link
      to="/register-course"
      className={`btn primary-purple-btn flex items-center justify-center gap-1 ${className}`}
    >
      <MdFreeCancellation /> Join Now
    </Link>
  );
};

export default FreeTrialButton;
