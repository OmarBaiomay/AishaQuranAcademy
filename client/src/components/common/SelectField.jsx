import React from "react";

const SelectField = ({ label, options, value, onChange, multiple = false, required = false }) => {
  return (
    <div className="relative mb-4">
      <label className="block mb-1 font-semibold text-gray-700">{label}</label>
      <select
        value={value}
        onChange={onChange}
        multiple={multiple}
        required={required}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
      >
        {options.length > 0 ? (
          options.map((option) => (
            <option key={option._id} value={option._id}>
              {option.name}
            </option>
          ))
        ) : (
          <option value="" disabled>No options available</option>
        )}
      </select>
    </div>
  );
};

export default SelectField;
