import mongoose from "mongoose";

const blogTagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const BlogTag = mongoose.model("BlogTag", blogTagSchema);

export default BlogTag;