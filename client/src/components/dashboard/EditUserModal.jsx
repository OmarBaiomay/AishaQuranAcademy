import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import axios from "axios";
import { toast } from "react-hot-toast";

function EditUserModal({ show, user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: { countryCode: "", number: "" },
    country: "",
    role: "Student",
    gender: "Male",
    age: "",
    profilePic: "",
    timeZone: "UTC",
  });

  const [countries, setCountries] = useState([]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showTimeZoneDropdown, setShowTimeZoneDropdown] = useState(false);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const countryData = response.data
          .map((country) => ({
            name: country.name.common,
            flag: country.flags?.png,
            code: country.idd?.root + (country.idd?.suffixes?.[0] || ""),
            timeZones: country.timezones || [],
          }))
          .filter((c) => c.code && c.timeZones.length > 0)
          .sort((a, b) => a.name.localeCompare(b.name))
          .reduce((unique, country) => {
            if (!unique.some(c => c.code === country.code)) {
              unique.push(country);
            }
            return unique;
          }, []);

        setCountries(countryData);
      } catch (error) {
        toast.error("Failed to fetch country data.");
      }
    };
    fetchCountryData();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || { countryCode: "", number: "" },
        country: user.country || "",
        gender: user.gender || "Male",
        role: user.role || "Student",
        age: user.age || "",
        profilePic: user.profilePic || "",
        timeZone: user.timeZone || "UTC",
      });
    }
  }, [user]);

  const handleCountryChange = (selectedCountry) => {
    const country = countries.find((c) => c.name === selectedCountry);
    if (!country) return;

    setFormData({
      ...formData,
      country: country.name,
      phone: { ...formData.phone, countryCode: country.code },
      timeZone: country.timeZones[0] || "UTC",
    });
    setShowCountryDropdown(false);
  };

  const handleTimeZoneChange = (selectedTimeZone) => {
    const country = countries.find((c) => c.timeZones.includes(selectedTimeZone));
    setFormData({
      ...formData,
      timeZone: selectedTimeZone,
      country: country?.name || formData.country,
      phone: { 
        ...formData.phone, 
        countryCode: country?.code || formData.phone.countryCode 
      },
    });
    setShowTimeZoneDropdown(false);
  };

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
      } else {
        response = await axiosInstance.post("/user", formData);
        toast.success("New user added successfully!");
      }
      onSave(response.data);
    } catch (error) {
      toast.error("Error saving user data.");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          ✖
        </button>
        
        <h2 className="text-xl font-bold mb-4">{user ? "Edit User" : "Add New User"}</h2>
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Age */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Phone Number */}
          <div className="mb-4 relative w-full">
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <div className="flex space-x-2 items-center w-full">
              <div className="relative">
                <button
                  type="button"
                  className="w-28 px-3 py-2 border border-gray-300 rounded-md flex items-center"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                >
                  {formData.phone.countryCode ? (
                    <>
                      <img
                        src={countries.find(c => c.code === formData.phone.countryCode)?.flag}
                        alt=""
                        className="w-5 h-5 mr-2"
                      />
                      {formData.phone.countryCode}
                    </>
                  ) : "Select"}
                </button>
                {showCountryDropdown && (
                  <div className="absolute top-12 left-0 w-40 bg-white border rounded-md shadow-lg max-h-60 overflow-auto z-50">
                    {countries.map((country) => (
                      <div
                        key={country.code}
                        className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleCountryChange(country.name)}
                      >
                        <img src={country.flag} alt="" className="w-5 h-5 mr-2" />
                        {country.code}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="text"
                name="phone.number"
                value={formData.phone.number}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Phone Number"
                required
              />
            </div>
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <select
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

          {/* Gender */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Time Zone */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Time Zone</label>
            <div className="relative">
              <button
                type="button"
                className="w-full px-3 py-2 border border-gray-300 rounded-md flex items-center"
                onClick={() => setShowTimeZoneDropdown(!showTimeZoneDropdown)}
              >
                {countries.find((c) => c.timeZones.includes(formData.timeZone))?.flag && (
                  <img
                    src={countries.find((c) => c.timeZones.includes(formData.timeZone))?.flag}
                    alt=""
                    className="w-5 h-5 mr-2"
                  />
                )}
                {formData.timeZone || "Select Time Zone"}
              </button>
              {showTimeZoneDropdown && (
                <div className="absolute top-12 left-0 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto z-50">
                  {countries.map((country) =>
                    country.timeZones.map((tz) => (
                      <div
                        key={tz}
                        className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleTimeZoneChange(tz)}
                      >
                        <img src={country.flag} alt="" className="w-5 h-5 mr-2" />
                        {tz}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded-md">
            {user ? "Save Changes" : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;