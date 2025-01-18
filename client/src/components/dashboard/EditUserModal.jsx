import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import axios from "axios";
import { toast } from "react-hot-toast";

function EditUserModal({ show, user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: { countryCode: "", number: "" }, // Updated phone structure
    country: "",
    role: "Student", // Default role
    gender: "Male", // Default gender
    profilePic: "",
    timeZone: "UTC", // Default time zone
  });

  const [countryCodes, setCountryCodes] = useState([]); // Store country codes from API
  const [timeZones, setTimeZones] = useState([]); // Store time zones

  useEffect(() => {
    // Fetch country codes when the component mounts
    const fetchCountryCodes = async () => {
      try {
        const response = await axios.get("http://restcountries.com/v3.1/all");
        const codes = response.data.map((country) => ({
          name: country.name.common,
          code: country.idd?.root + (country.idd?.suffixes?.[0] || ""),
        })).filter((c) => c.code); // Filter valid codes
        setCountryCodes(codes);
      } catch (error) {
        toast.error("Failed to fetch country codes.");
      }
    };

    // Fetch time zones (using a simple example API)
    const fetchTimeZones = async () => {
      try {
        const response = await axios.get("http://world-time1.p.rapidapi.com/timezone");
        setTimeZones(response.data);
      } catch (error) {
        toast.error("Failed to fetch time zones.");
      }
    };

    fetchCountryCodes();
    fetchTimeZones();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || { countryCode: "", number: "" },
        country: user.country || "",
        gender: user.gender || "Male", // Default to Male if gender is not defined
        role: user.role || "Student",
        profilePic: user.profilePic || "",
        timeZone: user.timeZone || "UTC", // Default to UTC if timeZone is not defined
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("phone.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        phone: { ...formData.phone, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (user) {
        response = await axiosInstance.put(`/user/${user._id}`, formData);
        toast.success("User updated successfully!");
        onSave(response.data);
      } else {
        response = await axiosInstance.post("/user", formData);
        toast.success("New user added successfully!");
        onSave(response.data);
      }
    } catch (error) {
      toast.error("Error saving user data.");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 relative">
        <h2 className="text-xl font-bold mb-4">{user ? "Edit User" : "Add New User"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <div className="flex space-x-2">
              <select
                name="phone.countryCode"
                value={formData.phone.countryCode}
                onChange={handleChange}
                className="w-1/3 px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="" disabled>
                  Code
                </option>
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code} ({country.name})
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="phone.number"
                value={formData.phone.number}
                onChange={handleChange}
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Phone Number"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Student">Student</option>
              <option value="Teacher">Teacher</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>
          {/* Gender Field */}
          <div className="mb-4">
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          {/* Time Zone Field */}
          <div className="mb-4">
            <label htmlFor="timeZone" className="block text-sm font-medium text-gray-700">
              Time Zone
            </label>
            <select
              id="timeZone"
              name="timeZone"
              value={formData.timeZone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="UTC">UTC</option>
              {timeZones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded-md">
              {user ? "Save Changes" : "Add User"}
            </button>
          </div>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;
