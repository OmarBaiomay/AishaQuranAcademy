import React, { useState } from "react";
import { Link } from "react-router-dom";

const UserCard = ({
  image,
  firstName,
  lastName,
  role,
  _id,
  onEdit,
  onExport,
  onDelete,
  onMessage,
}) => {
  // State to handle dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  return (
    <div className="sm:w-1/2 md:w-1/3 lg:w-1/6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 relative">
      <div className="flex justify-end px-4 pt-4">
        <button
          onClick={toggleDropdown} // Handle the button click to toggle dropdown
          id="dropdownButton"
          className="inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5"
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
        {/* Dropdown menu */}
        <div
          id="dropdown"
          className={`z-10 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute right-0 top-[40px] mt-2 ${
            isDropdownOpen ? "" : "hidden"
          }`}
        >
          <ul className="py-2" aria-labelledby="dropdownButton">
            <li>
              <button
                onClick={onEdit}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Edit
              </button>
            </li>
            <li>
              <button
                onClick={onExport}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Export Data
              </button>
            </li>
            <li>
              <button
                onClick={onDelete}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Delete
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center pb-10">
        <img
          className="w-24 h-24 mb-3 rounded-full shadow-lg"
          src={image}
          alt={`${firstName} ${lastName} image`}
        />
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {firstName} {lastName}
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">{role}</span>
        <div className="flex mt-4 md:mt-6">
          <button
            onClick={onMessage}
            className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Message
          </button>
          <Link
            to={`/dashboard/users/${_id}`}
            className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
