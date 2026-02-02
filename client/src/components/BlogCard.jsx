import React from "react";
import { Link } from "react-router-dom";
import { FiClock } from "react-icons/fi";
import dayjs from "dayjs";
import Button from "./common/Button";
import { FaArrowRight } from "react-icons/fa";

const BlogCard = ({ blog }) => {
  const imageUrl = blog.image?.startsWith("http")
    ? blog.image
    : `${import.meta.env.VITE_MEDIA_BASE_URL}${blog.image}`;

  return (
    <div className="bg-zinc-200/10 rounded-lg shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
      {/* Image */}
      <img
        src={imageUrl}
        alt={blog.title}
        loading="lazy"
        className="h-48 w-full object-cover rounded-t-lg"
      />

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Category Badge */}
        {blog.categories?.[0] && (
          <span className="inline-block bg-purple-100 text-purple-600 text-xs font-medium px-2 py-1 rounded">
            {blog.categories[0].name}
          </span>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
          {blog.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-gray-600 line-clamp-3">{blog.excerpt}</p>

        {/* Meta Info */}
        <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
          <FiClock className="text-purple-500" />
          <span>{dayjs(blog.createdAt).format("MMM D, YYYY")}</span> •
          <span>{blog.readingTime}</span>
        </div>

        {/* Read More Button */}
        <Link to={`/blogs/${blog.slug}`} className="block mt-3">
          <Button type="primary">
            Read More <FaArrowRight />
          </Button>
        </Link>

      </div>
    </div>
  );
};

export default BlogCard;
