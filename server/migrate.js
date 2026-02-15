import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Blog from "./models/blog.model.js";

const MONGO_URI = process.env.MONGO_URI;

async function migrateBlogs() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  const blogs = await Blog.find();

  for (const blog of blogs) {
    let updated = false;

    if (!blog.seoTitle) {
      blog.seoTitle = blog.title;
      updated = true;
    }

    if (!blog.seoDescription && blog.excerpt) {
      blog.seoDescription = blog.excerpt.substring(0, 160);
      updated = true;
    }

    if (!blog.seoKeywords) {
      blog.seoKeywords = [];
      updated = true;
    }

    if (updated) {
      await blog.save();
    }
  }

  console.log("✅ Blog SEO migration completed");
  process.exit();
}

migrateBlogs().catch(err => {
  console.error(err);
  process.exit(1);
});
