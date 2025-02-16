import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios.js";
import toast from "react-hot-toast";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  Filter,
  Sort,
  Resize,
  Page,
} from "@syncfusion/ej2-react-grids";

function ClassroomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [classroom, setClassroom] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingClass, setAddingClass] = useState(false);
  const [generatingClasses, setGeneratingClasses] = useState(false);

  // Fetch Classroom Details
  useEffect(() => {
    const getClassroomDetails = async () => {
      try {
        const response = await axiosInstance.get(`/classroom/${id}`);
        setClassroom(response.data);
        setClasses(response.data.classes || []);
      } catch (error) {
        toast.error("Error fetching classroom details!");
      }
    };

    getClassroomDetails();
  }, [id]);

  // ✅ Function to Generate Monthly Classes
  const handleGenerateMonthlyClasses = async () => {
    if (generatingClasses) return;

    setGeneratingClasses(true);
    try {
      const response = await axiosInstance.post(`/classroom/${id}/generate-monthly-classes`);
      setClasses([...classes, ...response.data.classes]); // Update state
      toast.success(`Generated ${response.data.classes.length} monthly classes successfully!`);
    } catch (error) {
      toast.error("Error generating monthly classes!");
      console.error("Error:", error);
    } finally {
      setGeneratingClasses(false);
    }
  };

  // ✅ Function to Add a Single Class Manually
  const handleAddClassToClassroom = async () => {
    if (addingClass) return;

    setAddingClass(true);
    try {
      const newClass = {
        day: "Monday", // Change this based on user input if needed
        time: "10:00 AM", // Change this based on user input if needed
        period: "AM",
        date: new Date().toISOString(),
        zoomLink: "https://zoom.us/meeting/random", // Example Zoom link
      };

      const response = await axiosInstance.post(`/classroom/${id}/classes`, newClass);
      setClasses([...classes, response.data.class]); // Update state
      toast.success("Class added successfully!");
    } catch (error) {
      toast.error("Error adding class!");
      console.error("Error:", error);
    } finally {
      setAddingClass(false);
    }
  };

  if (!classroom) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-20 px-10 w-full">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-zinc-600 mb-6">Classroom Details</h1>
      </header>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <p><strong>Student:</strong> {classroom.student.fullName}</p>
        <p><strong>Teacher:</strong> {classroom.teacher.fullName}</p>
        <p><strong>Supervisor:</strong> {classroom.supervisor.fullName}</p>
        <p><strong>Notes:</strong> {classroom.notes || "No notes available"}</p>
        <p><strong>Number of Classes:</strong> {classroom.classes?.length || 0}</p>
      </div>

      {/* ✅ Action Buttons for Adding Classes */}
      <div className="flex gap-4 mb-6">
        <button
          className={`text-white px-4 py-2 rounded-lg ${
            generatingClasses ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"
          }`}
          onClick={handleGenerateMonthlyClasses}
          disabled={generatingClasses}
        >
          {generatingClasses ? "Generating Classes..." : "Add Monthly Classes"}
        </button>

        <button
          className={`text-white px-4 py-2 rounded-lg ${
            addingClass ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={handleAddClassToClassroom}
          disabled={addingClass}
        >
          {addingClass ? "Adding Class..." : "Add Class to Classroom"}
        </button>
      </div>

      {/* ✅ Table of Classes */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-zinc-600 mb-4">Classes</h2>
        <GridComponent
          dataSource={classes}
          allowPaging={true}
          allowSorting={true}
          pageSettings={{ pageSize: 5 }}
          height={400}
        >
          <ColumnsDirective>
            <ColumnDirective field="day" headerText="Day" width="100" textAlign="Center" />
            <ColumnDirective field="time" headerText="Time" width="100" textAlign="Center" />
            <ColumnDirective field="date" headerText="Date" width="150" format="yMd" textAlign="Center" />
            <ColumnDirective field="zoomLink" headerText="Zoom Link" width="200" textAlign="Center" />
            <ColumnDirective
              headerText="Actions"
              template={(props) => (
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => navigate(`/dashboard/reports/add/${props._id}`)}
                >
                  Add Report
                </button>
              )}
              width="150"
              textAlign="Center"
            />
          </ColumnsDirective>
          <Inject services={[Resize, Sort, Filter, Page]} />
        </GridComponent>
      </div>

      <button
        className="bg-gray-200 text-black rounded-lg px-4 py-2 mt-4"
        onClick={() => navigate("/dashboard/classrooms")}
      >
        Back to Classrooms
      </button>
    </div>
  );
}

export default ClassroomDetails;
