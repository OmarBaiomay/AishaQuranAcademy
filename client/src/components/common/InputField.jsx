import React from "react";
import { BiEdit } from "react-icons/bi";

const InputField = ({ label, placeholder, value, onChange, icon }) => {
  return (
    <div className="relative mb-4">
      <label className="block mb-1 font-semibold text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
        required
      />
      {icon === "edit" && (
        <BiEdit className="absolute right-4 top-10 text-gray-400" size={18} />
      )}
    </div>
  );
};

export default InputField;
