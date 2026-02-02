import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Link } from "react-router-dom";

const RelatedBlogs = ({ blogId }) => {
  const [related, setRelated] = useState([]);

  const fetchRelated = async () => {
    try {
      const res = await axiosInstance.get(`/blogs/related/${blogId}`);
      setRelated(res.data);
    } catch (err) {
      console.error("Failed to fetch related blogs");
    }
  };

  useEffect(() => {
    if (blogId) fetchRelated();
  }, [blogId]);

  if (related.length === 0) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🧩 Related Posts</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {related.map((blog) => (
          <Link
            key={blog._id}
            to={`/blogs/${blog.slug}`}
            className="bg-gray-100 hover:shadow-md transition rounded-xl overflow-hidden"
          >
            <img
              src={blog.image}
              alt={blog.title}
              className="h-32 w-full object-cover"
              loading="lazy"
            />
            <div className="p-3">
              <p className="font-medium text-gray-800 line-clamp-2">{blog.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(blog.createdAt).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedBlogs;
