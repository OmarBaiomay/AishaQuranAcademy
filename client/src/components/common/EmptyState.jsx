import React from "react";
import { useNavigate } from "react-router-dom";
import { IoIosAddCircleOutline } from "react-icons/io";

const EmptyState = ({ title, message, btnText, btnLink }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      {/* Icon */}
      <IoIosAddCircleOutline className="text-gray-400 text-6xl mb-4" />

      {/* Title & Message */}
      <h2 className="text-2xl font-semibold text-gray-600">{title}</h2>
      <p className="text-gray-500 mt-2">{message}</p>

      {/* Action Button */}
      {btnText && btnLink && (
        <button
          className="mt-6 px-5 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all"
          onClick={() => navigate(btnLink)}
        >
          {btnText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
