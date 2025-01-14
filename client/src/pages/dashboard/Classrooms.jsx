import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios.js";
import ClassroomCard from "../../components/dashboard/ClassroomCard.jsx"; // Replace with your ClassroomCard component
import { FaList, FaTh } from "react-icons/fa"; // Icons for buttons
import { Link, useNavigate } from "react-router-dom";
import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Filter, VirtualScroll, Sort, Resize, ContextMenu, ExcelExport, Edit, PdfExport } from '@syncfusion/ej2-react-grids';

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
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching classrooms!");
      setLoading(false);
    }
  };

  useEffect(() => {
    getClassrooms();
  }, []);

  // Filter Classrooms
  const filteredClassrooms = classrooms.filter((classroom) =>
    classroom.student?.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const classroomListViewItems = [
    {
      headerText: 'Student',
      field: 'student.fullName',
      textAlign: 'Start',
      width: '150',
    },
    {
      headerText: 'Teacher',
      field: 'teacher.fullName',
      textAlign: 'Start',
      width: '150',
    },
    {
      headerText: 'Supervisor',
      field: 'supervisor.fullName',
      textAlign: 'Start',
      width: '150',
    },
    {
      headerText: 'Notes',
      field: 'notes',
      textAlign: 'Start',
      width: '200',
    },
  ];

  return (
    <div className="pt-20 px-10 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-600">Classrooms</h1>
        <div className="controlles flex gap-5 px-5">
          <button
            className="bg-purple-500 text-white rounded-lg px-3 py-1 text-sm"
            onClick={() => navigate('/dashboard/classrooms/add')}
          >
            Add Classroom
          </button>
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-zinc-200 text-zinc-600 rounded-lg px-3 py-1 text-sm"
          />
          {/* Buttons for List/Grid View */}
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

      <div className="flex justify-start items-center gap-7 flex-wrap mt-10">
        {loading ? (
          <div>Loading...</div>
        ) : viewMode === "grid" ? (
          filteredClassrooms.map((classroom) => (
            <ClassroomCard
              key={classroom._id}
              studentName={classroom.student?.fullName}
              teacherName={classroom.teacher?.fullName}
              supervisorName={classroom.supervisor?.fullName}
              notes={classroom.notes}
              onDetails={() => navigate(`/dashboard/classrooms/${classroom._id}`)} // Navigate to details page
            />
          ))
        ) : (
          <GridComponent
            id="classroomList"
            dataSource={filteredClassrooms}
            allowPaging
            allowSorting
            allowExcelExport
          >
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
