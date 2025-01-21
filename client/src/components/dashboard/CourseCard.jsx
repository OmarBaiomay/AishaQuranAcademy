import React, { useState } from "react";

const CourseCard = ({ image, title, forAdults, forKids, onEdit, onDelete }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  return (
    <div className="px-5 mb-5 bg-white border border-gray-200 rounded-lg shadow relative">
      <div className="flex justify-end pt-4">
        <button
          onClick={toggleDropdown}
          id="dropdownButton"
          className="inline-block text-gray-500 hover:bg-gray-100 rounded-lg text-sm p-1.5"
          type="button"
        >
          <span className="sr-only">Open dropdown</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 16 3"
          >
            <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
          </svg>
        </button>
        <div
          id="dropdown"
          className={`z-10 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 absolute right-0 top-[40px] mt-2 ${
            isDropdownOpen ? "" : "hidden"
          }`}
        >
          <ul className="py-2" aria-labelledby="dropdownButton">
            <li>
              <button
                onClick={onEdit}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
            </li>
            <li>
              <button
                onClick={onDelete}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Delete
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center pb-10">
        <img
          className="w-24 h-24 mb-3 rounded shadow-lg"
          src={image}
          alt={`${title} image`}
        />
        <h5 className="mb-1 text-xl font-medium">{title}</h5>
        <span className="text-sm text-gray-500">
          {forAdults ? "For Adults" : ""} {forKids ? "For Kids" : ""}
        </span>
      </div>
    </div>
  );
};

export default CourseCard;
