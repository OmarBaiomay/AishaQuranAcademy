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
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

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
      });
      if (user.profilePic) setImagePreview(user.profilePic);
    }
  }, [user]);

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

  const handleTimeZoneChange = (selectedTimeZone, countryName) => {
    setFormData({
      ...formData,
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
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
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

          {/* Other form fields... */}

          {/* Time Zone Selection with Country Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Time Zone</label>
            <div className="relative">
              <button
                type="button"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-left"
                onClick={() => setShowTimeZoneDropdown(!showTimeZoneDropdown)}
              >
                {countries.find(c => c.timeZones.includes(formData.timeZone))?.name && (
                  <span className="mr-2">
                    {countries.find(c => c.timeZones.includes(formData.timeZone)).name} -
                  </span>
                )}
                {formData.timeZone}
              </button>
              {showTimeZoneDropdown && (
                <div className="absolute top-12 left-0 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto z-50">
                  {countries.map((country) =>
                    country.timeZones.map((tz) => (
                      <div
                        key={tz}
                        className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-200"
                        onClick={() => handleTimeZoneChange(tz, country.name)}
                      >
                        <img src={country.flag} alt="" className="w-5 h-5 mr-2" />
                        <span className="mr-2">{country.name}</span>
                        <span className="text-gray-500">{tz}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Other form fields... */}
          <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded-md">
            {user ? "Save Changes" : "Add User"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;