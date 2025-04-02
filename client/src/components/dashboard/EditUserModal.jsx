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
    classroomId: "",
  });

  const [countries, setCountries] = useState([]);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showCountryNameDropdown, setShowCountryNameDropdown] = useState(false);
  const [showTimeZoneDropdown, setShowTimeZoneDropdown] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [timezoneSearch, setTimezoneSearch] = useState("");
  const [countrySearch, setCountrySearch] = useState("");
  const [countryNameSearch, setCountryNameSearch] = useState("");

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
          .sort((a, b) => a.name.localeCompare(b.name));

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
        classroomId: user.classroomId || "",
      });
      if (user.profilePic) setImagePreview(user.profilePic);
    }
  }, [user]);

  const filteredCountries = countries.filter(country =>
    `${country.name} ${country.code}`
      .toLowerCase()
      .includes(countrySearch.toLowerCase())
  );

  const filteredCountryNames = countries.filter(country =>
    country.name.toLowerCase().includes(countryNameSearch.toLowerCase())
  );

  const filteredTimezones = countries
    .flatMap(country =>
      country.timeZones.map(tz => ({
        ...country,
        timeZone: tz,
      }))
    )
    .filter(item =>
      `${item.name} ${item.timeZone}`
        .toLowerCase()
        .includes(timezoneSearch.toLowerCase())
    );

  const getCountryForTimezone = (timezone) => {
    return countries.find(country => 
      country.timeZones.includes(timezone)
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTimeZoneChange = (selectedTimeZone) => {
    setFormData({
      ...formData,
      timeZone: selectedTimeZone,
    });
    setShowTimeZoneDropdown(false);
    setTimezoneSearch("");
  };

  const handleCountryChange = (countryCode) => {
    const country = countries.find(c => c.code === countryCode);
    if (!country) return;

    setFormData({
      ...formData,
      country: country.name,
      phone: { ...formData.phone, countryCode: countryCode },
    });
    setShowCountryDropdown(false);
    setCountrySearch("");
  };

  const handleCountryNameChange = (countryName) => {
    const country = countries.find(c => c.name === countryName);
    if (!country) return;

    setFormData({
      ...formData,
      country: country.name,
      phone: { ...formData.phone, countryCode: country.code },
    });
    setShowCountryNameDropdown(false);
    setCountryNameSearch("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "classroomId" && formData.role === "Student" && formData.classroomId) {
        toast.error("Students cannot change their assigned classroom.");
        return;
    }

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
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", JSON.stringify(formData.phone));
      formDataToSend.append("country", formData.country);
      formDataToSend.append("role", formData.role);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("timeZone", formData.timeZone);
      formDataToSend.append("classroomId", formData.classroomId);
      if (selectedImage) formDataToSend.append("profilePic", selectedImage);

      let response;
      if (user) {
        response = await axiosInstance.put(`/user/${user._id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("User updated successfully!");
      } else {
        response = await axiosInstance.post("/user", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
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
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4">{user ? "Edit User" : "Add New User"}</h2>
        <form onSubmit={handleSubmit}>
          {/* Profile Picture Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
            <input
              type="file"
              className="form-input w-full border-gray-300 rounded-md shadow-sm"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-md shadow-md"
                />
              </div>
            )}
          </div>

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

          {/* Country Selection */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700">Country</label>
            <div className="relative">
              <button
                type="button"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-left flex items-center"
                onClick={() => setShowCountryNameDropdown(!showCountryNameDropdown)}
              >
                {formData.country ? (
                  <>
                    <img
                      src={countries.find(c => c.name === formData.country)?.flag}
                      alt=""
                      className="w-5 h-5 mr-2"
                    />
                    {formData.country}
                  </>
                ) : "Select Country"}
              </button>
              {showCountryNameDropdown && (
                <div className="absolute top-12 left-0 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto z-50">
                  <div className="sticky top-0 p-2 bg-white border-b">
                    <input
                      type="text"
                      placeholder="Search countries..."
                      className="w-full px-2 py-1 border rounded"
                      value={countryNameSearch}
                      onChange={(e) => setCountryNameSearch(e.target.value)}
                    />
                  </div>
                  {filteredCountryNames.map((country) => (
                    <div
                      key={country.code}
                      className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleCountryNameChange(country.name)}
                    >
                      <img src={country.flag} alt="" className="w-5 h-5 mr-2" />
                      <div className="text-sm">{country.name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                  ) : "Code"}
                </button>
                {showCountryDropdown && (
                  <div className="absolute top-12 left-0 w-40 bg-white border rounded-md shadow-lg max-h-60 overflow-auto z-50">
                    <div className="sticky top-0 p-2 bg-white border-b">
                      <input
                        type="text"
                        placeholder="Search codes..."
                        className="w-full px-2 py-1 border rounded"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                      />
                    </div>
                    {filteredCountries.map((country) => (
                      <div
                        key={country.code}
                        className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleCountryChange(country.code)}
                      >
                        <img src={country.flag} alt="" className="w-5 h-5 mr-2" />
                        <div>
                          <div className="text-sm">{country.code}</div>
                          <div className="text-xs text-gray-500 truncate">{country.name}</div>
                        </div>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-left flex items-center"
                onClick={() => setShowTimeZoneDropdown(!showTimeZoneDropdown)}
              >
                {formData.timeZone && (
                  <>
                    <img
                      src={getCountryForTimezone(formData.timeZone)?.flag}
                      alt=""
                      className="w-5 h-5 mr-2"
                    />
                    <div>
                      <span className="font-medium">
                        {getCountryForTimezone(formData.timeZone)?.name}
                      </span>
                      <span className="ml-2 text-gray-600">{formData.timeZone}</span>
                    </div>
                  </>
                )}
              </button>
              {showTimeZoneDropdown && (
                <div className="absolute top-12 left-0 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto z-50">
                  <div className="sticky top-0 p-2 bg-white border-b">
                    <input
                      type="text"
                      placeholder="Search timezones..."
                      className="w-full px-2 py-1 border rounded"
                      value={timezoneSearch}
                      onChange={(e) => setTimezoneSearch(e.target.value)}
                    />
                  </div>
                  {filteredTimezones.map(({ flag, name, timeZone }) => (
                    <div
                      key={timeZone}
                      className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleTimeZoneChange(timeZone)}
                    >
                      <img src={flag} alt="" className="w-5 h-5 mr-2" />
                      <div className="flex-1">
                        <div className="font-medium">{name}</div>
                        <div className="text-sm text-gray-500">{timeZone}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
            >
              {user ? "Save Changes" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;