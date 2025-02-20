import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../lib/axios";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Filter,
  Sort,
  Resize,
  Page,
  Search,
} from "@syncfusion/ej2-react-grids";
import { FaList, FaTh } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTeacher, setFilterTeacher] = useState("");
  const [filterStudent, setFilterStudent] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const navigate = useNavigate();

  // Fetch Reports & Populate Dropdown Lists
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axiosInstance.get("/reports");
        setReports(res.data);

        // Extract unique teachers & students for dropdowns
        setTeachers([...new Set(res.data.map(report => report.teacherName))]);
        setStudents([...new Set(res.data.map(report => report.studentName))]);
      } catch (error) {
        console.error("Error fetching reports:", error.message);
      }
    };

    fetchReports();
  }, []);

  // Open Delete Confirmation Modal
  const openDeleteModal = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  // ✅ Fully Fixed Delete Report Function
  const handleDelete = async () => {
    if (!selectedReport) {
      toast.error("No report selected!");
      return;
    }

    try {
      await axiosInstance.delete(`/reports/${selectedReport._id}`);

      // ✅ Immediately update the reports list
      setReports((prevReports) => prevReports.filter(report => report._id !== selectedReport._id));

      toast.success("Report deleted successfully!");
      setShowModal(false);
    } catch (error) {
      toast.error("Error deleting report!");
      console.error("Error:", error);
    }
  };

  // Filtered Reports Based on Search & Filters
  const filteredReports = reports.filter((report) => {
    const teacherMatch = !filterTeacher || report.teacherName === filterTeacher;
    const studentMatch = !filterStudent || report.studentName === filterStudent;
    const searchMatch =
      report.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.studentName.toLowerCase().includes(searchQuery.toLowerCase());

    return teacherMatch && studentMatch && searchMatch;
  });

  // Report Columns for Grid View
  const reportColumns = [
    { field: "className", headerText: "Class", width: "150", textAlign: "Center" },
    { field: "teacherName", headerText: "Teacher", width: "150", textAlign: "Center" },
    { field: "studentName", headerText: "Student", width: "150", textAlign: "Center" },
    {
      field: "assessment",
      headerText: "Assessment",
      width: "150",
      textAlign: "Center",
      template: (props) => (
        <span className="text-yellow-500 text-lg">
          {"★".repeat(props.assessment)}{"☆".repeat(5 - props.assessment)}
        </span>
      ),
    },
    { field: "classActivity", headerText: "Class Activity", width: "200", textAlign: "Center" },
    { field: "homework", headerText: "Homework", width: "200", textAlign: "Center" },
    {
      headerText: "Actions",
      template: (props) => (
        <div className="flex gap-2 justify-center">
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            onClick={() => navigate(`/dashboard/reports/edit/${props.classId}/${props._id}`)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            onClick={() => openDeleteModal(props)}
          >
            Delete
          </button>
        </div>
      ),
      width: "180",
      textAlign: "Center",
    },
  ];

  return (
    <div className="container mx-auto px-10 py-32 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-zinc-600">Class Reports</h1>

        {/* View Mode Toggle Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1 rounded ${
              viewMode === "list" ? "bg-purple-500 text-white" : "bg-zinc-200 text-zinc-600"
            }`}
          >
            <FaList />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1 rounded ${
              viewMode === "grid" ? "bg-purple-500 text-white" : "bg-zinc-200 text-zinc-600"
            }`}
          >
            <FaTh />
          </button>
        </div>
      </div>

      {/* Reports Grid/List View */}
      {viewMode === "list" ? (
        <GridComponent dataSource={filteredReports} allowPaging allowSorting pageSettings={{ pageSize: 10 }}>
          <ColumnsDirective>{reportColumns.map((col, index) => <ColumnDirective key={index} {...col} />)}</ColumnsDirective>
          <Inject services={[Resize, Sort, Filter, Page, Search]} />
        </GridComponent>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div key={report._id} className="bg-white shadow-lg rounded-lg p-6">
              <h2 className="text-xl font-bold">{report.className}</h2>
              <p className="text-gray-600">Teacher: {report.teacherName}</p>
              <p className="text-gray-600">Student: {report.studentName}</p>
              <p className="mt-2"><strong>Class Activity:</strong> {report.classActivity}</p>
              <p className="mt-2"><strong>Homework:</strong> {report.homework}</p>
              <div className="flex gap-2 mt-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => navigate(`/dashboard/reports/edit/${report.classId}/${report._id}`)}>Edit</button>
                <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={() => openDeleteModal(report)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete this report?</p>
            <div className="flex gap-3 mt-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={handleDelete}>Delete</button>
              <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
