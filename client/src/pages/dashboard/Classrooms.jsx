import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios.js";
import ClassroomCard from "../../components/dashboard/calssroom/ClassroomCard.jsx"; // Replace with your ClassroomCard component
import { FaList, FaTh } from "react-icons/fa"; // Icons for buttons
import { IoAdd } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Filter,
  VirtualScroll,
  Sort,
  Resize,
  ContextMenu,
  ExcelExport,
  Edit,
  PdfExport,
} from "@syncfusion/ej2-react-grids";

function Classrooms() {
  const navigate = useNavigate();
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Classrooms
  const getClassrooms = async () => {
    try {
      const response = await axiosInstance.get("/classroom");
      setClassrooms(response.data);
    } catch (error) {
      toast.error("Error fetching classrooms!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getClassrooms();
  }, []);

  // Filter Classrooms by Student Name
  const filteredClassrooms = classrooms.filter((classroom) =>
    classroom.student?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Define table columns for list view
  const classroomListViewItems = [
    { headerText: "Student", field: "student.fullName", textAlign: "Start", width: "150" },
    { headerText: "Teacher", field: "teacher.fullName", textAlign: "Start", width: "150" },
    { headerText: "Supervisor", field: "supervisor.fullName", textAlign: "Start", width: "150" },
    { headerText: "Notes", field: "notes", textAlign: "Start", width: "200" },
    {
      headerText: "Actions",
      template: (props) => (
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
          onClick={() => navigate(`/dashboard/reports/add/${props._id}`)}
        >
          Add Report
        </button>
      ),
      width: "150",
    },
  ];

  return (
    <div className="pt-20 px-7 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-600">Classrooms</h1>
        <div className="controlles flex gap-2 md:gap-5 px-5">
          {/* Add Classroom Button */}
          <button
            className="bg-purple-500 text-white rounded-lg px-3 py-1 text-sm hidden md:block"
            onClick={() => navigate("/dashboard/classrooms/add")}
          >
            Add Classroom
          </button>
          <button
            className="bg-purple-500 text-white rounded-lg px-3 py-1 text-sm block md:hidden"
            onClick={() => navigate("/dashboard/classrooms/add")}
          >
            <IoAdd />
          </button>
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-zinc-200 text-zinc-600 rounded-lg px-3 py-1 text-sm"
          />
          {/* View Mode Buttons */}
          <div className="flex justify-center items-center rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`${
                viewMode === "grid" ? "bg-purple-500 text-white" : "bg-zinc-200 text-zinc-600"
              } px-3 py-1 flex items-center gap-1 w-full h-full`}
            >
              <FaTh />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`${
                viewMode === "list" ? "bg-purple-500 text-white" : "bg-zinc-200 text-zinc-600"
              } px-3 py-1 flex items-center gap-1 w-full h-full`}
            >
              <FaList />
            </button>
          </div>
        </div>
      </div>

      {/* Classroom Display */}
      <div className="flex justify-start items-center gap-7 flex-wrap mt-10">
        {loading ? (
          <div>Loading...</div>
        ) : classrooms.length === 0 ? (
          <div className="flex justify-center items-center w-full">
            <EmptyState
              title="No Classrooms Yet"
              message="Start by creating a new classroom and managing your students easily."
              btnText="Create Your First Classroom"
              btnLink="/dashboard/classrooms/add"
            />
          </div>
        ) : viewMode === "grid" ? (
          filteredClassrooms.map((classroom) => (
            <div key={classroom._id} className={`bg-white shadow-lg rounded-lg p-6 ${classroom.status}`}>
              <h2 className="text-xl font-bold">{classroom.student?.fullName}'s Class</h2>
              <p className="text-gray-600">Teacher: {classroom.teacher?.fullName}</p>
              <p className="text-gray-600">Supervisor: {classroom.supervisor?.fullName}</p>
              <p className="text-gray-600">Notes: {classroom.notes}</p>
              <p>
                Status: 
                <strong>
                  {classroom.status
                    .split("_")  // Replace underscores with spaces
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
                    .join(" ")}
                </strong>
              </p>
              <p>Last Payment: {classroom.lastPaymentDate || "N/A"}</p>
              <p>Next Payment: {classroom.nextPaymentDate || "N/A"}</p>
              {/* Buttons: Details & Add Report */}
              <div className="flex gap-3 mt-4">
                <button
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                  onClick={() => navigate(`/dashboard/classrooms/${classroom._id}`)}
                >
                  Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <GridComponent id="classroomList" dataSource={filteredClassrooms} allowPaging allowSorting allowExcelExport>
            <ColumnsDirective>
              {classroomListViewItems.map((item, index) => (
                <ColumnDirective key={index} {...item} />
              ))}
            </ColumnsDirective>
            <Inject services={[Resize, Sort, ContextMenu, Filter, ExcelExport, Edit, PdfExport]} />
          </GridComponent>
        )}
      </div>
    </div>
  );
}

export default Classrooms;
