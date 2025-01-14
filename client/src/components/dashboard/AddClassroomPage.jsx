import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

function AddClassroomPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [classTimes, setClassTimes] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [notes, setNotes] = useState("");
  const [numberOfClassesPerMonth, setNumberOfClassesPerMonth] = useState(4);

  // Fetch students, teachers, and supervisors
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const [studentsRes, teachersRes, supervisorsRes] = await Promise.all([
          axiosInstance.get("/users?role=Student"),
          axiosInstance.get("/users?role=Teacher"),
          axiosInstance.get("/users?role=Supervisor"),
        ]);
        setStudents(studentsRes.data);
        setTeachers(teachersRes.data);
        setSupervisors(supervisorsRes.data);
      } catch (error) {
        toast.error("Error fetching users!");
      }
    };
    fetchUsers();
  }, []);

  // Filter teachers by student's gender
  useEffect(() => {
    if (selectedStudent) {
      const compatibleTeachers = teachers.filter(
        (teacher) => teacher.gender === selectedStudent.gender
      );
      setFilteredTeachers(compatibleTeachers);
    } else {
      setFilteredTeachers(teachers);
    }
  }, [selectedStudent, teachers]);

  // Update available times when a student and teacher are selected
  useEffect(() => {
    if (selectedStudent && selectedTeacher) {
      const compatibleTimes = selectedTeacher.availability.filter((teacherTime) =>
        selectedStudent.availability.some(
          (studentTime) =>
            teacherTime.day === studentTime.day &&
            teacherTime.hour === studentTime.hour &&
            teacherTime.period === studentTime.period &&
            !teacherTime.isBooked
        )
      );
      setAvailableTimes(compatibleTimes);
    }
  }, [selectedStudent, selectedTeacher]);

  const handleAddClassroom = async () => {
    if (!selectedStudent || !selectedTeacher || !selectedSupervisor || classTimes.length === 0) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      await axiosInstance.post("/classroom", {
        studentId: selectedStudent._id,
        teacherId: selectedTeacher._id,
        supervisorId: selectedSupervisor._id,
        classTimes,
        notes,
        numberOfClassesPerMonth,
      });
      toast.success("Classroom added successfully!");
      navigate("/dashboard/classrooms");
    } catch (error) {
      console.error("Error creating classroom:", error.message);
      toast.error("Error adding classroom!");
    }
  };

  return (
    <div className="pt-20 px-10 w-full">
      <h1 className="text-2xl font-bold text-zinc-600 mb-6">Add New Classroom</h1>
      <div className="grid gap-6">
        <div>
          <label className="form-label">Select Supervisor</label>
          <select
            className="form-input"
            onChange={(e) =>
              setSelectedSupervisor(
                supervisors.find((supervisor) => supervisor._id === e.target.value)
              )
            }
          >
            <option value="">Select Supervisor</option>
            {supervisors.map((supervisor) => (
              <option key={supervisor._id} value={supervisor._id}>
                {supervisor.fullName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Select Student</label>
          <select
            className="form-input"
            onChange={(e) =>
              setSelectedStudent(
                students.find((student) => student._id === e.target.value)
              )
            }
          >
            <option value="">Select Student</option>
            {students.map((student) => (
              <option key={student._id} value={student._id}>
                {student.fullName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Select Teacher</label>
          <select
            className="form-input"
            onChange={(e) =>
              setSelectedTeacher(
                filteredTeachers.find((teacher) => teacher._id === e.target.value)
              )
            }
          >
            <option value="">Select Teacher</option>
            {filteredTeachers.map((teacher) => (
              <option key={teacher._id} value={teacher._id}>
                {teacher.fullName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Available Times</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableTimes.map((time, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded border ${
                  classTimes.includes(time)
                    ? "bg-purple-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => {
                  if (classTimes.includes(time)) {
                    setClassTimes(classTimes.filter((t) => t !== time));
                  } else {
                    setClassTimes([...classTimes, time]);
                  }
                }}
              >
                {time.day} {time.hour} {time.period}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="form-label">Number of Classes Per Month</label>
          <input
            type="number"
            className="form-input"
            value={numberOfClassesPerMonth}
            onChange={(e) => setNumberOfClassesPerMonth(Number(e.target.value))}
          />
        </div>
        <div>
          <label className="form-label">Notes</label>
          <textarea
            className="form-input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes"
          />
        </div>
        <div className="flex justify-end">
          <button
            className="bg-gray-200 px-4 py-2 rounded mr-4"
            onClick={() => navigate("/dashboard/classrooms")}
          >
            Cancel
          </button>
          <button
            className="primary-purple-btn"
            onClick={handleAddClassroom}
          >
            Add Classroom
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddClassroomPage;
