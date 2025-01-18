import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios.js";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
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

  // Fetch Classroom Details
  const getClassroomDetails = async () => {
    try {
      const response = await axiosInstance.get(`/classroom/${id}`);
      const fetchedClasses = response.data.classes || [];
      const classesWithIds = fetchedClasses.map((cls) => ({
        ...cls,
        id: uuidv4(), // Assign a unique ID
      }));
      setClassroom(response.data);
      setClasses(classesWithIds);
    } catch (error) {
      toast.error("Error fetching classroom details!");
    }
  };

  // Add Monthly Classes
  const addMonthlyClasses = async () => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post(`/classroom/${id}/generate-monthly-classes`);
      const newClasses = response.data.classes.map((cls) => ({
        ...cls,
        id: uuidv4(), // Assign a unique ID
      }));
      setClasses((prev) => [...prev, ...newClasses]); // Update state with new classes
      toast.success(`${newClasses.length} monthly classes added successfully!`);
    } catch (error) {
      toast.error("Error adding monthly classes!");
      console.log("Error" , error);
    } finally {
      setLoading(false);
    }
  };

  // Reschedule Class
  const rescheduleClass = async (classId) => {
    try {
      const response = await axiosInstance.put(`/classroom/${id}/classes/${classId}/reschedule`);
      toast.success(`Class rescheduled to ${response.data.classItem.date}`);
    } catch (error) {
      toast.error("Error rescheduling class!");
    }
  };

  useEffect(() => {
    getClassroomDetails();
  }, [id]);

  if (!classroom) {
    return <div>Loading...</div>;
  }

  const classColumns = [
    { headerText: "Day", field: "day", width: "100", textAlign: "Center" },
    { headerText: "Time", field: "time", width: "100", textAlign: "Center" },
    { headerText: "Date", field: "date", width: "150", format: "yMd", textAlign: "Center" },
    { headerText: "Zoom Link", field: "zoomLink", width: "200", textAlign: "Center" },
    {
      headerText: "Actions",
      template: (props) => (
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={() => rescheduleClass(props.id)}
        >
          Reschedule
        </button>
      ),
      width: "150",
      textAlign: "Center",
    },
  ];

  return (
    <div className="pt-20 px-10 w-full">
      <header className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-zinc-600 mb-6">Classroom Details</h1>
        <button
          className={`text-white rounded-lg px-4 py-2 ${
            loading || classroom.classes.length > 0 ? "bg-gray-400 cursor-not-allowed" : "bg-purple-500"
          }`}
          onClick={addMonthlyClasses}
          disabled={loading || classroom.classes.length > 0}
        >
          {loading ? "Adding Classes..." : "Add Monthly Classes"}
        </button>
      </header>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <p><strong>Student:</strong> {classroom.student.fullName}</p>
        <p><strong>Teacher:</strong> {classroom.teacher.fullName}</p>
        <p><strong>Supervisor:</strong> {classroom.supervisor.fullName}</p>
        <p><strong>Notes:</strong> {classroom.notes || "No notes available"}</p>
        <p><strong>Number of Classes:</strong> {classroom.classes?.length || 0}</p>
      </div>

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
            {classColumns.map((col, index) => (
              <ColumnDirective key={index} {...col} />
            ))}
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
