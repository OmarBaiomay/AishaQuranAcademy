import React, { useState, useEffect } from 'react';
import avatar from '/assets/user.svg';
import { useNavigate } from 'react-router-dom';
import { userAuthStore } from '../store/useAuthStore';
import { axiosInstance } from '../lib/axios';
import { Calendar, Settings } from 'lucide-react';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';

const ProfilePage = () => {
  const { authUser } = userAuthStore();
  const [upcomingClass, setUpcomingClass] = useState(null);
  const [availability, setAvailability] = useState(authUser.availability || []);
  const [classroomData, setClassroomData] = useState({});
  const navigate = useNavigate();

  // Fetch upcoming class details
  useEffect(() => {
    const fetchUpcomingClass = async () => {
      try {
        const res = await axiosInstance.get(`/classes/upcoming/${authUser._id}`);
        setUpcomingClass(res.data);
        console.log(res.data);
      } catch (error) {
        console.error('Failed to fetch upcoming class:', error);
      }
    };

    fetchUpcomingClass();
  }, [authUser._id]);

  // Fetch classroom data for booked slots
  useEffect(() => {
    const fetchClassroomData = async () => {
      const bookedSlots = availability.filter((slot) => slot.isBooked && slot.classroomId);

      const classroomPromises = bookedSlots.map(async (slot) => {
        try {
          const res = await axiosInstance.get(`/classroom/${slot.classroomId}`);
          return { classroomId: slot.classroomId, studentName: res.data.student.fullName };
        } catch (error) {
          console.error(`Failed to fetch classroom ${slot.classroomId}:`, error);
          return null;
        }
      });

      const classrooms = await Promise.all(classroomPromises);
      const classroomsMap = classrooms.reduce((acc, cls) => {
        if (cls) acc[cls.classroomId] = cls.studentName;
        return acc;
      }, {});

      setClassroomData(classroomsMap);
    };

    if (availability.some((slot) => slot.isBooked)) {
      fetchClassroomData();
    }
  }, [availability]);

  return (
    <section className="container mx-auto px-4 py-24">
      <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center space-x-6">
          <div>
            <img
              src={avatar}
              alt={`${authUser.fullName} - Avatar`}
              className="w-32 h-32 rounded-full border-4 border-white shadow-md"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{authUser.fullName}</h1>
            <p className="text-xl text-gray-200">{authUser.role}</p>
            <p className="text-md text-gray-300">{authUser.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => navigate('/settings')}
          className="btn primary-purple-btn"
        >
          <TooltipComponent content='Calender'>
            <Settings />
          </TooltipComponent>
        </button>
        <button
          onClick={() => navigate('/dashboard/calender')}
          className="btn primary-purple-btn"
        >
          <TooltipComponent content='Calender'>
            <Calendar />
          </TooltipComponent>
        </button>
      </div>

       {/* Upcoming Class */}
       <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Upcoming Class</h2>
        {upcomingClass ? (
          <div className="text-lg">
            <p><strong>Day:</strong> {upcomingClass.day}</p>
            <p><strong>Time:</strong> {upcomingClass.time}</p>
            <p><strong>Date:</strong> {new Date(upcomingClass.date).toLocaleString()}</p>
            <p><strong>Student:</strong> {upcomingClass.studentName}</p>
            <p><strong>Teacher:</strong> {upcomingClass.teacherName}</p>
            <p>
              <strong>Zoom Link:</strong>{' '}
              <a
                href={upcomingClass.zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Join Meeting
              </a>
            </p>
          </div>
        ) : (
          <p>No upcoming class scheduled.</p>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-xl font-bold text-gray-700">Total Classes</h3>
          <p className="text-2xl text-purple-500">{authUser.totalClasses || 0}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-xl font-bold text-gray-700">Classes This Week</h3>
          <p className="text-2xl text-indigo-500">{authUser.weeklyClasses || 0}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-xl font-bold text-gray-700">Students Taught</h3>
          <p className="text-2xl text-blue-500">{authUser.studentsTaught || 0}</p>
        </div>
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h3 className="text-xl font-bold text-gray-700">Hours Taught</h3>
          <p className="text-2xl text-green-500">{authUser.hoursTaught || 0}</p>
        </div>
      </div>

      {/* Availability */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Availability</h2>
        <div className="space-y-4">
          {availability.map((slot, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div>
                <span className="font-semibold">{slot.day}</span> - {slot.hour} {slot.period}
              </div>
              {slot.isBooked ? (
                <span className="text-red-500 font-medium">
                  Booked by {classroomData[slot.classroomId] || 'Loading...'}
                </span>
              ) : (
                <span className="text-green-500 font-medium">Available</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
