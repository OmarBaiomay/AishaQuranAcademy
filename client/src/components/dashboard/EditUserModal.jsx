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
    profilePic: "",
    timeZone: "UTC",
  });

  const [countryCodes, setCountryCodes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [timeZones, setTimeZones] = useState([]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showTimeZoneDropdown, setShowTimeZoneDropdown] = useState(false);

  useEffect(() => {
    // ✅ Fetch country codes (Ensures unique values & adds flag)
    const fetchCountryCodes = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        const codes = response.data
          .map((country) => ({
            name: country.name.common,
            flag: country.flags?.png, // ✅ Added flag
            code: country.idd?.root + (country.idd?.suffixes?.[0] || ""),
          }))
          .filter((c) => c.code)
          .reduce((unique, country) => {
            if (!unique.some(c => c.code === country.code)) {
              unique.push(country);
            }
            return unique;
          }, []); // ✅ Removes duplicates

          const countryData = response.data
          .map((country) => ({
            name: country.name.common,
            flag: country.flags?.png,
            code: country.idd?.root + (country.idd?.suffixes?.[0] || ""),
            timeZones: country.timezones || [],
          }))
          .filter((c) => c.code && c.timeZones.length > 0)
          .sort((a, b) => a.name.localeCompare(b.name));
        
          setCountries(countryData);  
          setCountryCodes(codes);
          
      } catch (error) {
        toast.error("Failed to fetch country codes & Data.");
      }
    };
    fetchCountryCodes();
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
        profilePic: user.profilePic || "",
        timeZone: user.timeZone || "UTC",
      });
    }
  }, [user]);

   // ✅ Updates country, country code, and time zone together
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

  const handlePhoneCodeChange = (selectedCode) => {
    const country = countries.find((c) => c.code === selectedCode);
    if (!country) return;

    setFormData({
      ...formData,
      country: country.name,
      phone: { ...formData.phone, countryCode: selectedCode },
      timeZone: country.timeZones[0] || "UTC",
    });
  };

  const handleTimeZoneChange = (selectedTimeZone) => {
    const country = countries.find((c) => c.timeZones.includes(selectedTimeZone));
    if (!country) return;

    setFormData({
      ...formData,
      country: country.name,
      phone: { ...formData.phone, countryCode: country.code },
      timeZone: selectedTimeZone,
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

  const handleCountrySelect = (country) => {
    setFormData({ ...formData, phone: { ...formData.phone, countryCode: country.code } });
    setShowCountryDropdown(false);
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
      {/* ✅ Increased modal width */}
      <div className="bg-white p-6 rounded-lg w-[500px] relative">
        <h2 className="text-xl font-bold mb-4">{user ? "Edit User" : "Add New User"}</h2>
        <form onSubmit={handleSubmit}>
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

          {/* ✅ Age Field Restored */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Phone Number (Now includes custom dropdown for flags) */}
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
                        src={countryCodes.find(c => c.code === formData.phone.countryCode)?.flag}
                        alt=""
                        className="w-5 h-5 mr-2"
                      />
                      {formData.phone.countryCode}
                    </>
                  ) : "Select"}
                </button>
                {showCountryDropdown && (
                  <div className="absolute top-12 left-0 w-40 bg-white border rounded-md shadow-lg max-h-60 overflow-auto z-50">
                    {countryCodes.map((country) => (
                      <div
                        key={country.code}
                        className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleCountrySelect(country)}
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

          {/* ✅ Role Field Restored */}
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

          {/* ✅ Gender Field Restored */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Role</label>
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

           {/* ✅ Time Zone Dropdown (Fixed Display) */}
           <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Time Zone</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.timeZone}
              onChange={(e) => handleTimeZoneChange(e.target.value)}
            >
              <option value="">Select Time Zone</option>
              {countries.map((tz) => (
                <option key={tz.name} value={tz.timeZones[0]}>
                  {tz.flag && <img src={tz.flag} alt="" className="w-5 h-5 inline-block mr-2" />} 
                  {tz.name} - {tz.timeZones[0]}
                </option>
              ))}
            </select>
          </div>
          {/* Submit Button */}
          <div className="mb-4">
            <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded-md">
              {user ? "Save Changes" : "Add User"}
            </button>
          </div>
        </form>

        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          ✖
        </button>
      </div>
    </div>
  );
}

export default EditUserModal;
