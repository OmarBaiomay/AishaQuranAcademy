import mongoose from "mongoose";

const blogCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const BlogCategory = mongoose.model("BlogCategory", blogCategorySchema);

export default BlogCategory;
