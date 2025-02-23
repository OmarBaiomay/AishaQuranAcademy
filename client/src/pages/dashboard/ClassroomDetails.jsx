import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios.js";
import toast from "react-hot-toast";
import ClassFormModal from "../../components/dashboard/ClassFormModal";
import ConfirmDeleteModal from "../../components/dashboard/ConfirmDeleteModal";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [generatingClasses, setGeneratingClasses] = useState(false);
  const [classroomStatus, setClassroomStatus] = useState("");

  const status = ["free_trial", "ongoing", "overdue_bill", "freeze", "suspended"];

  useEffect(() => {
    const getClassroomDetails = async () => {
      try {
        const response = await axiosInstance.get(`/classroom/${id}`);
        setClassroom(response.data);
        setClasses(response.data.classes || []);
        setClassroomStatus(response.data.status);
      } catch (error) {
        toast.error("Error fetching classroom details!");
      }
    };

    getClassroomDetails();
  }, [id]);

  const handleChangeStatus = async (status) => {
    try {
      await axiosInstance.put(`/classroom/${id}/status`, { status });
      setClassroomStatus(status);
      toast.success(`Status updated to: ${status.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Error updating classroom status!");
    }
  };

  const handleGenerateMonthlyClasses = async () => {
    if (generatingClasses) return;

    setGeneratingClasses(true);
    try {
      const response = await axiosInstance.post(`/classroom/${id}/generate-monthly-classes`);
      setClasses([...classes, ...response.data.classes]);
      toast.success(`Generated ${response.data.classes.length} monthly classes successfully!`);
    } catch (error) {
      toast.error("Error generating monthly classes!");
      console.error("Error:", error);
    } finally {
      setGeneratingClasses(false);
    }
  };

  const handleAddClass = () => {
    setSelectedClass(null);
    setShowClassModal(true);
  };

  const handleRescheduleClass = (classData) => {
    setSelectedClass(classData);
    setShowClassModal(true);
  };

  const handleClassSave = (newClass) => {
    setClasses((prev) =>
      selectedClass
        ? prev.map((cls) => (cls._id === selectedClass._id ? newClass : cls))
        : [...prev, newClass]
    );
    setShowClassModal(false);
  };

  const handleDeleteClass = async () => {
    try {
      await axiosInstance.delete(`/classroom/${id}/classes/${classToDelete._id}`);
      setClasses((prev) => prev.filter(cls => cls._id !== classToDelete._id));
      toast.success("Class deleted successfully!");
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting class:", error);
      toast.error("Error deleting class!");
    }
  };

  if (!classroom) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pt-20 px-10 w-full">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-zinc-600">Classroom Details</h1>
        <button className="bg-gray-200 text-black rounded-lg px-4 py-2" onClick={() => navigate("/dashboard/classrooms")}>
          Back to Classrooms
        </button>
      </header>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6 relative">
        <div className="absolute top-0 right-0 btns-group">
          {status.map((stat) => (
            <button
              key={stat}
              className={`bg-gray-200 text-black px-4 py-2 transition-all ${classroomStatus === stat ? "bg-purple-600 text-white border-x-0" : ""}`}
              onClick={() => handleChangeStatus(stat)}
            >
              {stat.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
            </button>
          ))}
        </div>
        <p><strong>Student:</strong> {classroom.student.fullName}</p>
        <p><strong>Teacher:</strong> {classroom.teacher.fullName}</p>
        <p><strong>Supervisor:</strong> {classroom.supervisor.fullName}</p>
        <p><strong>Notes:</strong> {classroom.notes || "No notes available"}</p>
        <p><strong>Status:</strong> {classroomStatus.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}</p>
        <p><strong>Last Payment:</strong> {classroom.lastPaymentDate || "N/A"}</p>
        <p><strong>Next Payment:</strong> {classroom.nextPaymentDate || "N/A"}</p>
        <p><strong>Zoom Link:</strong> <a href={classroom.zoomLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{classroom.zoomLink}</a></p>
      </div>
      <div className="flex gap-4 mb-6">
        <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600" onClick={handleAddClass}>
          Add {classroomStatus !== "free_trial" ? "New Class" : "The First Class"}
        </button>
        {classroomStatus !== "free_trial" && 
          <button className={`text-white px-4 py-2 rounded-lg ${generatingClasses ? "bg-gray-400 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600"}`} onClick={handleGenerateMonthlyClasses} disabled={generatingClasses}>
            {generatingClasses ? "Generating Classes..." : "Add Monthly Classes"}
          </button>
        }
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-zinc-600 mb-4">Classes</h2>
        <GridComponent dataSource={classes} allowPaging allowSorting pageSettings={{ pageSize: 5 }} height={400}>
          <ColumnsDirective>
            <ColumnDirective field="day" headerText="Day" width="100" textAlign="Center" />
            <ColumnDirective field="time" headerText="Time" width="100" textAlign="Center" />
            <ColumnDirective field="date" headerText="Date" width="150" format="yMd" textAlign="Center" />
            <ColumnDirective
              headerText="Actions"
              template={(props) => (
                <div className="flex gap-2 justify-center">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => handleRescheduleClass(props)}>
                    Reschedule
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={() => { setClassToDelete(props); setShowDeleteModal(true); }}>Delete</button>
                </div>
              )}
              width="150"
              textAlign="Center"
            />
          </ColumnsDirective>
          <Inject services={[Resize, Sort, Filter, Page]} />
        </GridComponent>
      </div>
      <ConfirmDeleteModal show={showDeleteModal} onConfirm={handleDeleteClass} onCancel={() => setShowDeleteModal(false)} />
      <ClassFormModal show={showClassModal} onClose={() => setShowClassModal(false)} onSave={handleClassSave} classroomId={id} classData={selectedClass} />
    </div>
  );
}

export default ClassroomDetails;
