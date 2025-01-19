import React, { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios.js"; // Adjust this path if necessary

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null); // State for the selected course

  // Fetch courses from the backend
  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get("/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error.message);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div className="pt-20 px-10">

      <h1 className="text-3xl font-bold text-zinc-700 mb-8 text-center">Our Courses</h1>
      <div className="container">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div key={course._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img
              src={course.image || "https://via.placeholder.com/300"}
              alt={course.title}
              className="w-full h-52 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-bold text-zinc-800">{course.title}</h2>
              <div className="mt-4">
                {course.forAdults && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mr-2">For Adults</span>}
                {course.forKids && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">For Kids</span>}
              </div>
              <button
                className="block bg-purple-500 text-white text-center rounded-lg px-4 py-2 mt-6 hover:bg-purple-600"
                onClick={() => setSelectedCourse(course)} // Set the selected course to display popup
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
      </div>

      {/* Popup for course details */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedCourse(null)} // Close the popup
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-zinc-800 mb-4">{selectedCourse.title}</h2>
            <p className="text-zinc-600 mb-6">{selectedCourse.about}</p>
            <h3 className="text-lg font-bold text-zinc-800 mb-2">What will the student learn?</h3>
            <ul className="list-disc list-inside text-zinc-600">
              {selectedCourse.content.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <div className="mt-6">
              {selectedCourse.forAdults && <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mr-2">For Adults</span>}
              {selectedCourse.forKids && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">For Kids</span>}
            </div>
            <button
              className="bg-purple-500 text-white text-center rounded-lg px-4 py-2 mt-6 hover:bg-purple-600"
              onClick={() => setSelectedCourse(null)} // Close popup button
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
