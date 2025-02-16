import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import { useNavigate, useParams } from "react-router-dom";

const ReportFormPage = () => {
  const { classId, reportId } = useParams();
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (reportId) {
      const fetchReport = async () => {
        try {
          const res = await axiosInstance.get(`/reports/${reportId}`);
          setContent(res.data.content);
        } catch (error) {
          console.error("Error fetching report:", error.message);
        }
      };
      fetchReport();
    }
  }, [reportId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (reportId) {
        await axiosInstance.put(`/reports/${reportId}`, { content });
      } else {
        await axiosInstance.post("/reports", { classId, content });
      }
      navigate("/dashboard/reports");
    } catch (error) {
      console.error("Error saving report:", error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-6">
        {reportId ? "Edit Report" : "Add Report"}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 shadow-lg rounded-lg">
        <label className="block mb-4">
          <span className="text-gray-700 font-semibold">Report Content:</span>
          <textarea
            className="w-full p-2 mt-2 border rounded"
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
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
