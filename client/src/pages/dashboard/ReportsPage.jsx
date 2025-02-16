import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import { useNavigate } from "react-router-dom";

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  // Fetch Reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axiosInstance.get("/reports");
        setReports(res.data);
      } catch (error) {
        console.error("Error fetching reports:", error.message);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">Class Reports</h1>

      {reports.length === 0 ? (
        <p className="text-center text-gray-600">No reports available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div key={report._id} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-bold">{report.className}</h2>
              <p className="text-gray-600">{report.teacherName}</p>
              <p className="mt-2">{report.content}</p>
              <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => navigate(`/dashboard/reports/edit/${report._id}`)}
              >
                Edit Report
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
