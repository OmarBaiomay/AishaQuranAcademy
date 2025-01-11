import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-hot-toast";

function EditUserModal({ show, user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    fullName: "",  // Default value is an empty string
    email: "",
    phone: "",
    country: "",
    role: "Student", // Default role
    gender: "",
    profilePic: "",
  });

  // Initialize form fields if editing an existing user
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",  // Ensure default value is empty string
        email: user.email || "",
        phone: user.phone || "",
        country: user.country || "",
        gender: user.gender || "",
        role: user.role || "Student", // Default to "Student" if undefined
        profilePic: user.profilePic || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;
      if (user) {
        // Editing existing user
        response = await axiosInstance.put(`/user/${user._id}`, formData);
        toast.success("User updated successfully!");
        onSave(response.data); // Pass the updated user to the parent
      } else {
        // Adding new user
        response = await axiosInstance.post("/user", formData);
        toast.success("New user added successfully!");
        onSave(response.data); // Pass the new user to the parent
      }
    } catch (error) {
      toast.error("Error saving user data.");
    }
  };

  if (!show) return null; // If modal isn't visible, don't render it

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg w-96">
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
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
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
          <div className="mb-4">
            <button
              type="submit"
              className="bg-purple-500 text-white px-4 py-2 rounded-md"
            >
              {user ? "Save Changes" : "Add User"}
            </button>
          </div>
        </form>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✖
        </button>
      </div>
    </div>
  );
}

export default EditUserModal;
