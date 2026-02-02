import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const BlogSidebar = ({ currentBlogId, blog }) => {
  const [related, setRelated] = useState([]);
  const [archive, setArchive] = useState([]);

  // 🔁 Fetch related blogs
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await axiosInstance.get(`/blogs/related/${currentBlogId}`);
        setRelated(res.data);
      } catch (err) {
        console.error("❌ Failed to load related blogs.");
      }
    };
    if (currentBlogId) fetchRelated();
  }, [currentBlogId]);

  // 📆 Fetch archive months
  useEffect(() => {
    const fetchArchive = async () => {
      try {
        const res = await axiosInstance.get("/blogs/archives");
        setArchive(res.data);
      } catch (err) {
        console.error("❌ Failed to load archive months.");
      }
    };
    fetchArchive();
  }, []);

  return (
    <aside className="hidden lg:block w-full max-w-xs sticky top-24 self-start space-y-10">
      
      {/* 🧩 Related Blogs */}
      {/* {related.length > 0 && (
        <div className="bg-white shadow p-4 rounded-lg">
          <h3 className="font-semibold mb-3 text-lg">🧩 Related Posts</h3>
          <ul className="space-y-2 text-sm">
            {related.map((item) => (
              <li key={item._id}>
                <Link to={`/blogs/${item.slug}`} className="text-purple-600 hover:underline">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )} */}

      {/* 🗃️ Archive */}
      {/* <div className="bg-white shadow p-4 rounded-lg">
        <h3 className="font-semibold mb-3 text-lg">📅 Archive</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          {archive.map((item, i) => (
            <li key={i} className="flex justify-between">
              <Link to={`/blogs?month=${item.value}`} className="hover:text-purple-500">
                {item.label}
              </Link>
              <span className="text-xs text-gray-400">({item.count})</span>
            </li>
          ))}
        </ul>
      </div> */}

      {/* 🧑 Author Info */}
      <div className="mt-12 border-t pt-6">
        <div className="flex items-center gap-4">
          <img src="/assets/user.svg" alt="Author" className="w-12 h-12 rounded-full" />
          <div>
            <p className="font-semibold">{blog?.author?.name || "Aisha Admin"}</p>
            <p className="text-sm text-gray-500">Author at Aisha Quran Academy</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default BlogSidebar;
