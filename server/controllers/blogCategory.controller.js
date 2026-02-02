import BlogCategory from "../models/blogCategory.model.js";
import BlogTag from "../models/blogTag.model.js";
import Blog from "../models/blog.model.js";

// ✅ Create Category
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCategory = await BlogCategory.create({ name, description });
    res.status(201).json({ message: "Category created successfully", category: newCategory });
  } catch (error) {
    res.status(500).json({ message: "Error creating category", error });
  }
};

// ✅ Get All Categories with Blog Count
export const getAllCategories = async (req, res) => {
  try {
    const categories = await BlogCategory.find();

    const counts = await Blog.aggregate([
      { $unwind: "$categories" },
      { $group: { _id: "$categories", count: { $sum: 1 } } }
    ]);

    const withCounts = categories.map((cat) => {
      const found = counts.find((c) => c._id.toString() === cat._id.toString());
      return { ...cat.toObject(), blogCount: found?.count || 0 };
    });

    res.status(200).json(withCounts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

// ✅ Update Category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existing = await BlogCategory.findOne({ name: name.trim(), _id: { $ne: id } });
    if (existing) {
      return res.status(409).json({ message: "A category with this name already exists" });
    }

    const updated = await BlogCategory.findByIdAndUpdate(
      id,
      { name: name.trim(), description },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ message: "Category updated successfully", category: updated });
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).json({ message: "Failed to update category" });
  }
};

// ✅ Delete Category with Check
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const blogsWithCategory = await Blog.findOne({ categories: id });
    if (blogsWithCategory) {
      return res.status(400).json({ message: "Cannot delete: Category is used in blog posts." });
    }

    await BlogCategory.findByIdAndDelete(id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
  }
};

// ✅ Create Tag
export const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    const newTag = await BlogTag.create({ name });
    res.status(201).json({ message: "Tag created successfully", tag: newTag });
  } catch (error) {
    res.status(500).json({ message: "Error creating tag", error });
  }
};

// ✅ Get All Tags with Blog Count
export const getAllTags = async (req, res) => {
  try {
    const tags = await BlogTag.find();

    const counts = await Blog.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } }
    ]);

    const withCounts = tags.map((tag) => {
      const found = counts.find((t) => t._id.toString() === tag._id.toString());
      return { ...tag.toObject(), blogCount: found?.count || 0 };
    });

    res.status(200).json(withCounts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tags", error });
  }
};

// ✅ Update Tag
export const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Tag name is required" });
    }

    const existing = await BlogTag.findOne({ name: name.trim(), _id: { $ne: id } });
    if (existing) {
      return res.status(409).json({ message: "A tag with this name already exists" });
    }

    const updated = await BlogTag.findByIdAndUpdate(id, { name: name.trim() }, { new: true });

    if (!updated) return res.status(404).json({ message: "Tag not found" });

    res.status(200).json({ message: "Tag updated successfully", tag: updated });
  } catch (err) {
    console.error("Error updating tag:", err);
    res.status(500).json({ message: "Failed to update tag" });
  }
};

// ✅ Delete Tag with Check
export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;

    const blogWithTag = await Blog.findOne({ tags: id });
    if (blogWithTag) {
      return res.status(400).json({ message: "Cannot delete: Tag is used in blog posts." });
    }

    await BlogTag.findByIdAndDelete(id);
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting tag", error });
  }
};
