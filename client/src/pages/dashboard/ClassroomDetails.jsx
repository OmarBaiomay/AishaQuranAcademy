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
