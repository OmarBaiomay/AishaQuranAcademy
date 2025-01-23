import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios.js";
import { FaList, FaTh } from "react-icons/fa";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Page,
  Sort,
  Toolbar,
  Edit,
  Filter,
  ExcelExport,
  PdfExport,
} from "@syncfusion/ej2-react-grids";
import { Link } from "react-router-dom";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch testimonials
  const getTestimonials = async () => {
    try {
      const response = await axiosInstance.get("/testimonials");
      setTestimonials(response.data);
      setLoading(false);
    } catch (error) {
      toast.error("Error fetching testimonials!");
      setLoading(false);
    }
  };

  useEffect(() => {
    getTestimonials();
  }, []);

  // Handle Delete Testimonial
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/testimonials/${id}`);
      toast.success("Testimonial deleted successfully!");
      getTestimonials(); // Refresh the testimonials list
    } catch (error) {
      toast.error("Error deleting testimonial.");
    }
  };

  const filteredTestimonials = testimonials.filter((testimonial) =>
    testimonial.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const testimonialListViewItems = [
    {
      headerText: "User Name",
      field: "userName",
      textAlign: "Start",
      width: "150",
    },
    {
      headerText: "Stars",
      field: "stars",
      textAlign: "Center",
      width: "100",
    },
    {
      headerText: "Opinion",
      field: "opinion",
      textAlign: "Start",
      width: "200",
    },
    {
      headerText: "Actions",
      template: (props) => (
        <div className="flex gap-2">
          <Link
            to={`/dashboard/testimonials/edit/${props._id}`}
            className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
          >
            Edit
          </Link>
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
        <h1 className="text-2xl font-bold text-zinc-600">Testimonials</h1>
        <div className="controls flex gap-5 px-5">
          <Link to="/dashboard/testimonials/add" className="primary-purple-btn">
            Add Testimonial
          </Link>
          <input
            type="text"
            placeholder="Search by user name"
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
          filteredTestimonials.map((testimonial) => (
            <div
              key={testimonial._id}
              className="bg-white shadow rounded-lg p-4 w-full md:w-1/3 lg:w-1/4"
            >
              <div className="flex flex-col items-center">
                <img
                  src={testimonial.userImage || "https://via.placeholder.com/150"}
                  alt={testimonial.userName}
                  className="w-16 h-16 rounded-full mb-4"
                />
                <h3 className="text-lg font-bold">{testimonial.userName}</h3>
                <p className="text-gray-600">{testimonial.opinion}</p>
                <p className="text-yellow-500 mt-2">
                  {"★".repeat(testimonial.stars)}{" "}
                  {"☆".repeat(5 - testimonial.stars)}
                </p>
                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/dashboard/testimonials/edit/${testimonial._id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(testimonial._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <GridComponent
            id="testimonialList"
            dataSource={filteredTestimonials}
            allowPaging
            allowSorting
            toolbar={["Add", "Search"]}
            pageSettings={{ pageSize: 10 }}
          >
            <ColumnsDirective>
              {testimonialListViewItems.map((item, index) => (
                <ColumnDirective key={index} {...item} />
              ))}
            </ColumnsDirective>
            <Inject
              services={[Page, Sort, Toolbar, Edit, Filter, ExcelExport, PdfExport]}
            />
          </GridComponent>
        )}
      </div>
    </div>
  );
}

export default Testimonials;
