import React from "react";
import { FaQuestionCircle } from "react-icons/fa"; // Import the question mark icon

const ConfirmDeleteModal = ({ show, userName, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <div className="flex justify-center mb-4">
          <FaQuestionCircle className="text-red-500 text-4xl" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 text-center mb-4">
          Are you sure you want to delete <p className="font-bold">{userName}?</p>
        </h3>
        <p className="text-center text-gray-600 mb-6">
          This action cannot be undone.
        </p>
        <div className="flex justify-between gap-4">
          <button
            onClick={onCancel}
            className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
