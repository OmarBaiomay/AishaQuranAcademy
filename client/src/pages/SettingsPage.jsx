import React, { useState } from 'react';
import { userAuthStore } from '../store/useAuthStore';
import axios from 'axios';

const SettingsPage = () => {
  const { authUser } = userAuthStore();
  const [formData, setFormData] = useState(authUser);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put(`/api/profile/${authUser._id}`, formData);
      alert('Settings updated successfully!');
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  };

  return (
    <section className="container mx-auto px-4 py-24">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Edit Profile</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone.number"
              value={formData.phone.number}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  phone: { ...formData.phone, number: e.target.value },
                })
              }
              className="form-input"
            />
          </div>
          <button
            type="button"
            onClick={handleSave}
            className="btn primary-purple-btn"
          >
            Save Changes
          </button>
        </form>
      </div>
    </section>
  );
};

export default SettingsPage;
