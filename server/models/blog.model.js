import mongoose from "mongoose";
import slugify from "slugify";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },

  // 🔹 SEO
  seoTitle: {
    type: String,
  },
  seoDescription: {
    type: String,
  },
  // Stored as a comma-separated string (e.g. "keyword1, keyword2")
  seoKeywords: { type: String },

  slug: { type: String, unique: true }, // ✅ SEO-friendly URL
  excerpt: { type: String },            // ✅ fallback for meta description
  content: { type: String, required: true },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogCategory" }],
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogTag" }],

  image: { type: String, default: "" },

  isFeatured: { type: Boolean, default: false },
  published: { type: Boolean, default: false },

  views: { type: Number, default: 0 },
  readingTime: { type: String },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});


blogSchema.pre("validate", function (next) {
  // Slug
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // SEO fallbacks
  if (!this.seoTitle && this.title) {
    this.seoTitle = this.title;
  }

  if (!this.seoDescription && this.excerpt) {
    this.seoDescription = this.excerpt.substring(0, 160);
  }

  next();
});


const Blog = mongoose.model("Blog", blogSchema);
export default Blog;

