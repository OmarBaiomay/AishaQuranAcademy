// src/pages/ErrorPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = ({ message = "Something went wrong." }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-5xl font-bold text-red-600 mb-4">Error</h1>
      <p className="text-xl mb-6">{message}</p>
      <button
        onClick={() => navigate(-1)}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        🔙 Go Back
      </button>
    </div>
  );
};

export default ErrorPage;
