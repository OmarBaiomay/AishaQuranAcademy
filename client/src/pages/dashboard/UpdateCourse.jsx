import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import Loader from "../../components/Loader";

const UpdateCourse = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the course ID from the URL

  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [content, setContent] = useState([]);
  const [forAdults, setForAdults] = useState(false);
  const [forKids, setForKids] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch course details
  const fetchCourse = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/courses/${id}`);
      const { title, about, content, forAdults, forKids, image } = response.data;
      setTitle(title);
      setAbout(about);
      setContent(content);
      setForAdults(forAdults);
      setForKids(forKids);
      setImagePreview(image); // Use the existing image URL for preview
    } catch (error) {
      console.error("Error fetching course details:", error.message);
      toast.error("Failed to load course details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const handleAddContent = () => {
    setContent([...content, ""]);
  };

  const handleContentChange = (index, value) => {
    const updatedContent = [...content];
    updatedContent[index] = value;
    setContent(updatedContent);
  };

  const handleRemoveContent = (index) => {
    const updatedContent = [...content];
    updatedContent.splice(index, 1);
    setContent(updatedContent);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Update preview URL
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("about", about);
    formData.append("content", JSON.stringify(content));
    formData.append("forAdults", forAdults);
    formData.append("forKids", forKids);
    if (image) formData.append("image", image);

    setLoading(true);
    try {
      await axiosInstance.put(`/courses/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Course updated successfully!");
      navigate("/dashboard/courses");
    } catch (error) {
      console.error("Error updating course:", error.message);
      toast.error("Error updating course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 px-10 w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Update Course</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 grid gap-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Title
          </label>
          <input
            type="text"
            className="form-input w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* About */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            About Course
          </label>
          <textarea
            className="form-input w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows="4"
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Content
          </label>
          {content.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 items-center mb-2"
            >
              <input
                type="text"
                className="form-input flex-1 border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                value={item}
                onChange={(e) => handleContentChange(index, e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => handleRemoveContent(index)}
                className="text-red-500 font-bold"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddContent}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
          >
            Add Content Item
          </button>
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Image
          </label>
          <input
            type="file"
            className="form-input w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="mt-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md shadow-md"
              />
            </div>
          )}
        </div>

        {/* Who is the course for */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Who is the course for?
          </label>
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="form-checkbox rounded text-purple-600 focus:ring-purple-500"
                checked={forAdults}
                onChange={(e) => setForAdults(e.target.checked)}
              />
              For Adults
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="form-checkbox rounded text-purple-600 focus:ring-purple-500"
                checked={forKids}
                onChange={(e) => setForKids(e.target.checked)}
              />
              For Kids
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow-md hover:bg-gray-300"
            onClick={() => navigate("/dashboard/courses")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Course"}
          </button>
        </div>
      </form>
      {loading && <Loader />}
    </div>
  );
};

export default UpdateCourse;
