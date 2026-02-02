import React from "react";
import { Link } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";

const Breadcrumbs = ({ items }) => {
  return (
    <div className="flex items-center gap-2 text-gray-500 mb-4">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <Link to={item.path} className="hover:text-purple-500">
            {item.label}
          </Link>
          {index < items.length - 1 && <FiChevronRight />}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
