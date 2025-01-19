import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    about: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "", // Optional: Use a placeholder image URL if not provided
    },
    content: {
      type: [String], // Array of strings for course content
      default: [],
    },
    forAdults: {
      type: Boolean,
      default: false,
    },
    forKids: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
