import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "", // Optional: URL or path to the blog image
    },
    tags: {
      type: [String], // Array of tags for the blog
      default: [],
    },
    categories: {
      type: [String], // Array of categories for the blog
      default: [],
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
