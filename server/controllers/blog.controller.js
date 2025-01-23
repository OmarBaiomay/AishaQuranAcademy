import Blog from "../models/blog.model.js";

// Create a new blog
export const createBlog = async (req, res) => {
    const { title, content, author, tags, categories } = req.body;
  
    try {
      const newBlog = new Blog({
        title,
        content,
        author,
        image: req.file ? req.file.path : "", // Image upload (if provided)
        tags: tags ? JSON.parse(tags) : [], // Parse tags if sent as a JSON string
        categories: categories ? JSON.parse(categories) : [], // Parse categories if sent as a JSON string
      });
  
      const savedBlog = await newBlog.save();
  
      res.status(201).json({
        message: "Blog created successfully",
        blog: savedBlog,
      });
    } catch (error) {
      console.error("Error creating blog:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
// Get all blogs
export const getAllBlogs = async (req, res) => {
    try {
      const blogs = await Blog.find().sort({ createdAt: -1 });
      res.status(200).json(blogs);
    } catch (error) {
      console.error("Error fetching blogs:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  
  // Get a single blog by ID
  export const getBlogById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const blog = await Blog.findById(id);
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      res.status(200).json(blog);
    } catch (error) {
      console.error("Error fetching blog:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  
  // Update a blog
  export const updateBlog = async (req, res) => {
    const { id } = req.params;
    const { title, content, author, tags, categories } = req.body;
  
    try {
      const blog = await Blog.findById(id);
  
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      // Update fields
      if (title) blog.title = title;
      if (content) blog.content = content;
      if (author) blog.author = author;
      if (tags) blog.tags = tags ? JSON.parse(tags) : blog.tags;
      if (categories) blog.categories = categories ? JSON.parse(categories) : blog.categories;
      if (req.file) blog.image = req.file.path; // Update image if provided
  
      const updatedBlog = await blog.save();
  
      res.status(200).json({
        message: "Blog updated successfully",
        blog: updatedBlog,
      });
    } catch (error) {
      console.error("Error updating blog:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  
  // Delete a blog
  export const deleteBlog = async (req, res) => {
    const { id } = req.params;
  
    try {
      const blog = await Blog.findByIdAndDelete(id);
  
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
  
      res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
      console.error("Error deleting blog:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  