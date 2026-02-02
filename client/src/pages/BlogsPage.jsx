import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import BlogCard from "../components/BlogCard";
import ShareButtons from "../components/ShareButtons";
import { FiShare2 } from "react-icons/fi";

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [popular, setPopular] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const limit = 6;

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/blogs`, {
        params: { page, limit, search, published: true },
      });
      setBlogs(res.data.blogs);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopular = async () => {
    try {
      const res = await axiosInstance.get("/blogs/popular");
      setPopular(res.data);
    } catch (err) {
      console.error("Failed to fetch popular blogs:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
    fetchPopular();
  }, [search, page]);

  const currentUrl = window.location.href;

  return (
    <section className="px-4 md:px-8 pt-36 pb-16 max-w-6xl mx-auto">
      <Helmet>
        <title>Blog – Aisha Quran Academy</title>
        <meta name="description" content="Explore articles about Quran, Arabic, and Islamic learning." />
        <meta property="og:title" content="Blog – Aisha Quran Academy" />
        <meta property="og:description" content="Explore articles about Quran, Arabic, and Islamic learning." />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* 🔥 Hero Section */}
      <div className="text-center mb-10" data-aos="fade-up">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">📚 Aisha Quran Blog</h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Discover inspirational posts about Quranic studies, Arabic language, Islamic reflections, and more.
        </p>
      </div>

      {/* 🔗 Share Section */}
      <div className="flex justify-center mb-6" data-aos="fade-up">
        <ShareButtons url={currentUrl} title="Check out these amazing blogs from Aisha Quran Academy!" />
      </div>

      {/* 🔍 Search */}
      <div className="mb-6" data-aos="fade-up">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          className="w-full px-4 py-3 border rounded-lg"
          placeholder="Search blogs by title..."
        />
      </div>

      {/* 📝 Blogs Grid */}
      <div className="grid gap-6 md:grid-cols-3" data-aos="fade-up">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => <BlogSkeleton key={idx} />)
          : blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
      </div>

      {/* 📄 Pagination */}
      {!loading && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${page === i + 1 ? "bg-purple-600 text-white" : "bg-gray-200"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* 🔥 Popular Blogs */}
      <div className="mt-16" data-aos="fade-up">
        <h2 className="text-2xl font-bold mb-4">🔥 Popular Blogs</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {popular.map((blog) => (
            <Link key={blog._id} to={`/blogs/${blog.slug}`} className="bg-white p-3 shadow rounded-lg hover:shadow-lg transition">
              <img
                src={blog.image}
                alt={blog.title}
                className="h-32 w-full object-cover rounded mb-2"
                loading="lazy"
              />
              <p className="font-medium text-gray-700 text-sm line-clamp-2">{blog.title}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogsPage;

// ✅ Skeleton Loader
const BlogSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md animate-pulse">
    <div className="h-48 bg-gray-300 rounded-t-lg" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-4 bg-gray-300 rounded w-1/2" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
      <div className="h-8 bg-purple-200 rounded w-1/3 mt-4" />
    </div>
  </div>
);
