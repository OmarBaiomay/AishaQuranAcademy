import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../../../lib/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ClassFormModal = ({ show, onClose, onSave, classroomId, classData }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [period, setPeriod] = useState("AM");

  useEffect(() => {
    if (classData) {
      const existingDate = new Date(classData.date);
      setSelectedDate(existingDate);
      setDay(existingDate.toLocaleDateString("en-US", { weekday: "long" }));
      const hours = existingDate.getHours();
      const minutes = existingDate.getMinutes().toString().padStart(2, "0");
      setTime(`${hours % 12 || 12}:${minutes}`);
      setPeriod(hours >= 12 ? "PM" : "AM");
    }
  }, [classData]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setDay(date.toLocaleDateString("en-US", { weekday: "long" }));
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    setTime(`${hours % 12 || 12}:${minutes}`);
    setPeriod(hours >= 12 ? "PM" : "AM");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const classDetails = {
      day,
      time: `${time} ${period}`,
      period,
      date: selectedDate.toISOString(),
    };

    try {
      let response;
      if (classData) {
        response = await axiosInstance.put(`/classroom/${classroomId}/classes/${classData._id}/reschedule`, classDetails);
        toast.success("Class rescheduled successfully!");
      } else {
        response = await axiosInstance.post(`/classroom/${classroomId}/classes`, classDetails);
        toast.success("Class added successfully!");
      }
      onSave(response.data.class);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error saving class details!");
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[400px] relative">
        <h2 className="text-xl font-bold mb-4">{classData ? "Reschedule Class" : "Add New Class"}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Select Date & Time</label>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <p><strong>Day:</strong> {day}</p>
          <p><strong>Time:</strong> {time} {period}</p>

          <div className="flex gap-3 mt-4">
            <button type="submit" className="bg-purple-500 text-white px-4 py-2 rounded-md">
              {classData ? "Reschedule" : "Add Class"}
            </button>
            <button type="button" className="bg-gray-300 px-4 py-2 rounded-md" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassFormModal;
