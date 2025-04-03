import React from "react";

const ClassroomCard = ({ studentName, teacherName, supervisorName, notes, onDetails }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 w-full max-w-sm">
      <h3 className="text-lg font-bold text-zinc-800 mb-2">Classroom Details</h3>
      <p className="text-sm text-zinc-600">
        <strong>Student:</strong> {studentName || "N/A"}
      </p>
      <p className="text-sm text-zinc-600">
        <strong>Teacher:</strong> {teacherName || "N/A"}
      </p>
      <p className="text-sm text-zinc-600">
        <strong>Supervisor:</strong> {supervisorName || "N/A"}
      </p>
      <p className="text-sm text-zinc-600">
        <strong>Notes:</strong> {notes || "No notes available"}
      </p>
      <div className="mt-4">
        <button
          className="bg-purple-500 text-white rounded-lg px-4 py-2 w-full"
          onClick={onDetails}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ClassroomCard;
