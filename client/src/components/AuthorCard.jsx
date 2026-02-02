import React from "react";
import { FiUser } from "react-icons/fi";

const AuthorCard = ({ author }) => {
  return (
    <div className="mt-12 bg-white p-6 rounded-xl shadow flex items-center gap-4">
      <div className="w-16 h-16 bg-purple-100 text-purple-500 rounded-full flex items-center justify-center text-2xl">
        <FiUser />
      </div>
      <div>
        <h4 className="font-semibold text-gray-800 text-lg">
          {author?.name || "Aisha Admin"}
        </h4>
        <p className="text-sm text-gray-500">Instructor & Contributor</p>
      </div>
    </div>
  );
};

export default AuthorCard;
