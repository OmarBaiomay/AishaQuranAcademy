import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios.js";
import avatar from "/assets/user.svg";
import toast from "react-hot-toast";

function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/user/${id}`);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch user details.");
        setLoading(false);
        navigate("/dashboard/users");
      }
    };

    fetchUser();
  }, [id, navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex items-center p-6 bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
          <img
            src={user.profilePic || avatar}
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg mr-6"
          />
          <div>
            <h1 className="text-2xl font-bold">{user.fullName}</h1>
            <p className="text-sm">{user.role}</p>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-700">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-base font-medium text-gray-800">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Gender</p>
              <p className="text-base font-medium text-gray-800">{user.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="text-base font-medium text-gray-800">
                {user.phone.countryCode} {user.phone.number}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Country</p>
              <p className="text-base font-medium text-gray-800">{user.country}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Time Zone</p>
              <p className="text-base font-medium text-gray-800">{user.timeZone}</p>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-gray-700 mt-6">Availability</h2>
          {user.availability.length > 0 ? (
            <div className="mt-4">
              {user.availability.map((slot, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md mb-2"
                >
                  <span>{slot.day}</span>
                  <span>
                    {slot.hour} {slot.period}
                  </span>
                  <span>{slot.isBooked ? "Booked" : "Available"}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2">No availability data provided.</p>
          )}
        </div>

        <div className="flex justify-end p-6 bg-gray-50">
          <button
            onClick={() => navigate("/dashboard/users")}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDetails;
