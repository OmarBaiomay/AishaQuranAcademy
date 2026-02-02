import mongoose from "mongoose";
import slugify from "slugify"; // optional: if you want to auto-generate slug server-side

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true }, // ✅ SEO slug
  excerpt: { type: String },            // ✅ short preview
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogCategory" }],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogTag" }],
  image: { type: String, default: "" },
  isFeatured: { type: Boolean, default: false },   // ✅ show in hero/card
  published: { type: Boolean, default: false },     // ✅ draft vs public
  views: { type: Number, default: 0 },              // ✅ tracking
  readingTime: { type: String },                    // ✅ display like “5 min read”
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

// ✅ Optional: Auto-generate slug if not set
blogSchema.pre("validate", function (next) {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
