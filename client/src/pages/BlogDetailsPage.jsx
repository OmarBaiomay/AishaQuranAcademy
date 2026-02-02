import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { Helmet } from "react-helmet-async";
import dayjs from "dayjs";
import ShareButtons from "../components/ShareButtons";
import RelatedBlogs from "../components/RelatedBlogs";
import BackToTopButton from "../components/common/BackToTopButton";
import ArchiveSidebar from "../components/BlogSidebar";

const BlogDetailsPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
  try {
    const res = await axiosInstance.get(`/blogs/slug/${slug}`);
    setBlog(res.data);

    // 🌍 Fetch IP info
    const ipRes = await fetch("https://ipwho.is/");
    const ipData = await ipRes.json();

    if (ipData.success) {
      // 📤 Send IP info to backend
      await axiosInstance.post(`/blogs/view/${slug}`, ipData);
    }
  } catch (error) {
    console.error("Error loading blog or tracking view:", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchBlog();
  }, [slug]);

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!blog) return <div className="p-6 text-center text-red-600">Blog not found.</div>;

  const imageUrl = blog.image?.startsWith("http")
    ? blog.image
    : `${import.meta.env.VITE_MEDIA_BASE_URL}${blog.image}`;

  return (
    <section className="relative px-4 md:px-8 pt-28 pb-12 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-8">
      {/* SEO */}
      <Helmet>
        <title>{blog.title} | Aisha Quran Academy</title>
        <meta name="description" content={blog.excerpt || ""} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:image" content={blog.image} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.excerpt} />
        <meta name="twitter:image" content={blog.image} />
      </Helmet>

      {/* Blog Content */}
      <article>
        {/* Title */}
        <h1 className="text-3xl font-bold mb-2 text-gray-900">{blog.title}</h1>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
          <span>✍️ {blog.author?.name || "Aisha Admin"}</span>
          <span>🗓️ {dayjs(blog.createdAt).format("MMMM D, YYYY")}</span>
          <span>⏱ {blog.readingTime}</span>
          {blog.categories?.map((cat) => (
            <span key={cat._id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
              {cat.name}
            </span>
          ))}
          {blog.tags?.map((tag) => (
            <span key={tag._id} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
              #{tag.name}
            </span>
          ))}
        </div>

        {/* Image */}
        {blog.image && (
          <img src={imageUrl} alt={blog.title} className="rounded-lg w-full h-auto mb-6" />
        )}

        {/* Share Buttons */}
        <div className="block lg:hidden top-24 bottom-24 pb-5">
            <h3 className="pb-2">Share :</h3>
          <ShareButtons url={window.location.href} title={blog.title} />
        </div>

        {/* Blog Content */}
        <div
          className="prose prose-purple max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />


        {/* Related Posts */}
        <div className="mt-12">
          <RelatedBlogs blogId={blog._id} />
        </div>
      </article>

      {/* Right Sidebar */}
      <aside className="lg:block hidden sticky top-28 h-fit">
        <div className="space-y-8">
          <ArchiveSidebar />
          <ShareButtons url={window.location.href} title={blog.title} />
        </div>
      </aside>

      <BackToTopButton />
    </section>
  );
};

export default BlogDetailsPage;
