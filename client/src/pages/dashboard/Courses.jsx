import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios.js";
import CourseCard from "../../components/dashboard/CourseCard.jsx";
import { FaList, FaTh } from "react-icons/fa";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Page, // Import the Page module
  Filter,
  VirtualScroll,
  Sort,
  Resize,
  ContextMenu,
  ExcelExport,
  Edit,
  PdfExport,
  Toolbar,
} from "@syncfusion/ej2-react-grids";
import { Link, useNavigate } from "react-router-dom";

function Courses() {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Courses
  const getCourses = async () => {
    try {
      const response = await axiosInstance.get("/courses");
      setCourses(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching courses!");
      setLoading(false);
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  // Handle Delete Course
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/courses/${id}`);
      toast.success("Course deleted successfully!");
      getCourses(); // Refresh the course list
    } catch (error) {
      toast.error("Error deleting course.");
    }
  };

  // Filter Courses
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const courseListViewItems = [
    {
      headerText: "Title",
      field: "title",
      textAlign: "Start",
      width: "150",
    },
    {
      headerText: "For Adults",
      field: "forAdults",
      textAlign: "Center",
      width: "100",
    },
    {
      headerText: "For Kids",
      field: "forKids",
      textAlign: "Center",
      width: "100",
    },
    {
      headerText: "About",
      field: "about",
      textAlign: "Start",
      width: "200",
    },
    {
      headerText: "Actions",
      template: (props) => (
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/dashboard/courses/edit/${props._id}`)}
            className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(props._id)}
            className="bg-red-500 text-white px-2 py-1 rounded text-sm"
          >
            Delete
          </button>
        </div>
      ),
      textAlign: "Center",
      width: "150",
    },
  ];

  return (
    <div className="pt-20 px-10 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-600">Courses</h1>
        <div className="controls flex gap-5 px-5">
          <Link to="/dashboard/courses/add" className="primary-purple-btn">
            Add Course
          </Link>
          <input
            type="text"
            placeholder="Search by title"
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
          filteredCourses.map((course) => (
            <CourseCard
              key={course._id}
              image={course.image}
              title={course.title}
              forAdults={course.forAdults}
              forKids={course.forKids}
              onEdit={() => navigate(`/dashboard/courses/edit/${course._id}`)}
              onDelete={() => handleDelete(course._id)}
            />
          ))
        ) : (
          <GridComponent
            id="courseList"
            dataSource={filteredCourses}
            allowPaging
            allowSorting
            allowExcelExport
            pageSettings={{ pageSize: 10 }} // Enable paging with 10 items per page
          >
            <ColumnsDirective>
              {courseListViewItems.map((item, index) => (
                <ColumnDirective key={index} {...item} />
              ))}
            </ColumnsDirective>
            <Inject
              services={[
                Page, // Inject Page module
                Resize,
                Sort,
                ContextMenu,
                Filter,
                ExcelExport,
                Edit,
                PdfExport,
                Toolbar,
              ]}
            />
          </GridComponent>
        )}
      </div>
    </div>
  );
}

export default Courses;
