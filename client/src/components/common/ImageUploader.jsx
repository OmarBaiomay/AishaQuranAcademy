import React, { useState } from "react";
import { FiImage } from "react-icons/fi";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";

const ImageUploader = ({ image, setImage }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // ✅ Upload image to backend → Cloudinary with progress
  const uploadToCloudinary = async (file) => {
    
    const formData = new FormData();
    formData.append("image", file);
    
    console.log("FILE TO UPLOAD:", file);
    console.log("FORM DATA ENTRIES:", [...formData.entries()]);

    try {
      setUploading(true);
      setProgress(0);
  
      const res = await axiosInstance.post("/uploads/image/blog", formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });
  
      if (res.data.url) {
        setImage(res.data.url);
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("No image URL returned.");
      }
  
    } catch (err) {
      console.error("Upload failed front:", err);
      toast.error("Image upload failed.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };
  

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadToCloudinary(file);
    else toast.error("No file selected.");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadToCloudinary(file);
  };

  return (
    <div
      className={`border-2 border-dashed p-6 text-center rounded-lg transition ${
        dragActive ? "border-purple-500 bg-purple-100" : "border-gray-300"
      }`}
      onDragEnter={() => setDragActive(true)}
      onDragLeave={() => setDragActive(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-2">
        <FiImage size={30} className="text-gray-500" />
        <p className="text-gray-500">
          {uploading ? "Uploading image..." : "Drag and drop an image here or"}
        </p>
        <label className="cursor-pointer bg-purple-500 text-white px-4 py-2 rounded-lg">
          Browse
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>

      {/* ✅ Progress Bar */}
      {uploading && (
        <div className="mt-4 w-full bg-gray-200 rounded-lg h-3 overflow-hidden">
          <div
            className="bg-purple-500 h-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* ✅ Preview Image */}
      {image && !uploading && (
        <div className="mt-4">
          <img
            src={image}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
