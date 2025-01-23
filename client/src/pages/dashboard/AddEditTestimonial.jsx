import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const AddEditTestimonial = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the ID from the URL for edit mode

  const [userName, setUserName] = useState("");
  const [stars, setStars] = useState(1);
  const [opinion, setOpinion] = useState("");
  const [userImage, setUserImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false); // To manage form submission state

  // Fetch testimonial details in edit mode
  const fetchTestimonial = async () => {
    if (!id) return; // Skip if in add mode

    setLoading(true);
    try {
      const response = await axiosInstance.get(`/testimonials/${id}`);
      const { userName, stars, opinion, userImage } = response.data;

      setUserName(userName);
      setStars(stars);
      setOpinion(opinion);
      setImagePreview(userImage); // Set preview for existing image
    } catch (error) {
      toast.error("Error fetching testimonial details.");
      console.error("Fetch Error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonial();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setUserImage(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("stars", stars);
    formData.append("opinion", opinion);
    if (userImage) formData.append("userImage", userImage);

    setLoading(true);
    try {
      if (id) {
        // Update mode
        await axiosInstance.put(`/testimonials/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Testimonial updated successfully!");
      } else {
        // Add mode
        await axiosInstance.post("/testimonials", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Testimonial created successfully!");
      }
      navigate("/dashboard/testimonials"); // Navigate back to the testimonials list
    } catch (error) {
      toast.error("Error saving testimonial. Please try again.");
      console.error("Save Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 px-10 w-full max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        {id ? "Edit Testimonial" : "Add Testimonial"}
      </h1>
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 grid gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User Name
          </label>
          <input
            type="text"
            className="form-input w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stars
          </label>
          <select
            className="form-input w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            value={stars}
            onChange={(e) => setStars(Number(e.target.value))}
            required
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star} Star{star > 1 && "s"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opinion
          </label>
          <textarea
            className="form-input w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
            rows="4"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User Image
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
                className="w-24 h-24 object-cover rounded-full shadow-md"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md shadow-md hover:bg-gray-300"
            onClick={() => navigate("/dashboard/testimonials")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? (id ? "Updating..." : "Submitting...") : id ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditTestimonial;
