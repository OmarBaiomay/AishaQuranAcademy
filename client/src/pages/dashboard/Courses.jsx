import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios.js";
import CourseCard from "../../components/dashboard/CourseCard.jsx";
import { FaList, FaTh } from "react-icons/fa"; 
import { GridComponent, ColumnsDirective, ColumnDirective, Inject, Filter, VirtualScroll, Sort, Resize, ContextMenu, ExcelExport, Edit, PdfExport } from "@syncfusion/ej2-react-grids";

function Courses() {
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
  ];

  return (
    <div className="pt-20 px-10 w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-600">Courses</h1>
        <div className="controls flex gap-5 px-5">
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
              onEdit={() => toast.success(`Edit ${course.title}`)}
              onDelete={() => toast.success(`Delete ${course.title}`)}
            />
          ))
        ) : (
          <GridComponent
            id="courseList"
            dataSource={filteredCourses}
            allowPaging
            allowSorting
            allowExcelExport
          >
            <ColumnsDirective>
              {courseListViewItems.map((item, index) => (
                <ColumnDirective key={index} {...item} />
              ))}
            </ColumnsDirective>
            <Inject
              services={[Resize, Sort, ContextMenu, Filter, ExcelExport, Edit, PdfExport]}
            />
          </GridComponent>
        )}
      </div>
    </div>
  );
}

export default Courses;
