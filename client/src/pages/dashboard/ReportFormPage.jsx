import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

const ReportFormPage = () => {
  const { classId, reportId } = useParams();
  const [assessment, setAssessment] = useState(5);
  const [classActivity, setClassActivity] = useState("");
  const [homework, setHomework] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (reportId) {
      const fetchReport = async () => {
        try {
          const res = await axiosInstance.get(`/reports/${reportId}`);
          setAssessment(res.data.assessment);
          setClassActivity(res.data.classActivity);
          setHomework(res.data.homework);
        } catch (error) {
          console.error("Error fetching report:", error.message);
        }
      };
      fetchReport();
    }
  }, [reportId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!window.confirm("Are you sure you want to submit this report?")) return;

    try {
      if (reportId) {
        await axiosInstance.put(`/reports/${reportId}`, { classId, assessment, classActivity, homework });
      } else {
        await axiosInstance.post("/reports", { classId, assessment, classActivity, homework });
      }

      toast.success("Report saved successfully!");
      navigate("/dashboard/reports");
    } catch (error) {
      console.error("Error saving report:", error.response?.data || error.message);
      toast.error("Error saving report. Check console for details.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-32">
      <h1 className="text-3xl font-bold text-center mb-6">
        {reportId ? "Edit Report" : "Add Report"}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <label className="block mb-4">
          <span className="text-gray-700 font-semibold">Assessment (1-5 Stars):</span>
          <input
            type="number"
            min="1"
            max="5"
            value={assessment}
            onChange={(e) => setAssessment(Number(e.target.value))}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 font-semibold">Class Activity:</span>
          <input
            type="text"
            value={classActivity}
            onChange={(e) => setClassActivity(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 font-semibold">Homework:</span>
          <input
            type="text"
            value={homework}
            onChange={(e) => setHomework(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Save Report
        </button>
      </form>
    </div>
  );
};

export default ReportFormPage;
