import Blog from "../models/blog.model.js";
import BlogView from "../models/blogView.model.js";
import sanitizeHtml from "sanitize-html";
import slugify from "slugify";
import { getReadingTime } from "../utils/getReadingTime.js";

// 🧠 Generate excerpt (first 30 words max)
const generateExcerpt = (html = "") => {
  const plainText = html.replace(/<[^>]*>?/gm, "");
  return plainText.split(" ").slice(0, 30).join(" ") + "...";
};

// ✅ Create Blog
export const createBlog = async (req, res) => {
  try {
    const { title, content, image, categories, tags, published = false } = req.body;

    const author = req.user?._id || "678bc77af835b76c1db3dac2";

    const sanitizedContent = sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "figure", "figcaption", "iframe"]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ["src", "alt", "style", "width", "height"],
        figure: ["style"],
        figcaption: ["style"],
        iframe: ["src", "width", "height", "allow", "allowfullscreen", "frameborder"]
      }
    });

    const blog = await Blog.create({
      title,
      slug: slugify(title, { lower: true, strict: true }),
      excerpt: generateExcerpt(sanitizedContent),
      content: sanitizedContent,
      image,
      categories,
      tags,
      published,
      author,
      readingTime: getReadingTime(sanitizedContent)
    });

    res.status(201).json({ message: "Blog post created successfully!", blog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ message: "Failed to create blog post", error: error.message });
  }
};

// ✅ Get All Blogs
export const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", published } = req.query;

    const query = {
      ...(published !== undefined && { published }),
      ...(search && { title: { $regex: search, $options: "i" } })
    };

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .populate("author", "name")
      .populate("categories")
      .populate("tags")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({ total, page: +page, blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ message: "Failed to fetch blogs", error: error.message });
  }
};

// ✅ Get Blog by ID
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id)
      .populate("author", "name")
      .populate("categories")
      .populate("tags");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Failed to fetch blog", error: error.message });
  }
};

// ✅ Update Blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image, categories, tags, published } = req.body;

    const sanitizedContent = sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "figure", "figcaption", "iframe"]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        img: ["src", "alt", "style", "width", "height"],
        figure: ["style"],
        figcaption: ["style"],
        iframe: ["src", "width", "height", "allow", "allowfullscreen", "frameborder"]
      }
    });

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        slug: slugify(title, { lower: true, strict: true }),
        content: sanitizedContent,
        excerpt: generateExcerpt(sanitizedContent),
        image,
        categories,
        tags,
        published,
        readingTime: getReadingTime(sanitizedContent),
        updatedAt: Date.now()
      },
      { new: true }
    );

    if (!updatedBlog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ message: "Blog updated successfully!", updatedBlog });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({ message: "Failed to update blog", error: error.message });
  }
};

// ✅ Toggle Publish
export const toggleBlogPublish = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.published = !blog.published;
    blog.updatedAt = Date.now();
    await blog.save();

    res.status(200).json({ message: `Blog ${blog.published ? "published" : "unpublished"}!`, blog });
  } catch (error) {
    console.error("Error toggling publish state:", error);
    res.status(500).json({ message: "Failed to update publish state", error: error.message });
  }
};

// ✅ Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await Blog.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog deleted successfully!" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ message: "Failed to delete blog", error: error.message });
  }
};

// ✅ Get Blog by Slug
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate("author", "name")
      .populate("categories")
      .populate("tags");
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    res.status(500).json({ message: "Failed to fetch blog", error: error.message });
  }
};

// ✅ Related Blogs
export const getRelatedBlogs = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const related = await Blog.find({
      _id: { $ne: blog._id },
      published: true,
      $or: [
        { categories: { $in: blog.categories } },
        { tags: { $in: blog.tags } }
      ]
    })
      .limit(5)
      .select("title slug image createdAt")
      .sort({ createdAt: -1 });

    res.status(200).json(related);
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    res.status(500).json({ message: "Failed to fetch related blogs", error: error.message });
  }
};

// ✅ Popular Blogs
export const getPopularBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ published: true })
      .sort({ views: -1 })
      .limit(5)
      .select("title slug image views");
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching popular blogs:", error);
    res.status(500).json({ message: "Failed to fetch popular blogs", error: error.message });
  }
};

// ✅ Count Blog View (+ Prevent Double Count by IP)
export const incrementBlogView = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    const alreadyViewed = await BlogView.findOne({ blog: blog._id, ipAddress: req.ip });
    if (!alreadyViewed) {
      blog.views += 1;
      await blog.save();
      await BlogView.create({ blog: blog._id, ipAddress: req.ip });
    }

    res.json({ message: "View counted" });
  } catch (error) {
    console.error("Failed to count view:", error);
    res.status(500).json({ message: "Failed to count view", error: error.message });
  }
};

// 📊 View Analytics Controller
export const getBlogViewAnalytics = async (req, res) => {
  try {
    const pipeline = [
      {
        $facet: {
          // 🗺️ Top countries
          topCountries: [
            { $group: { _id: "$country", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],

          // 🌐 Top ISPs
          topISPs: [
            { $group: { _id: "$connection.isp", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
          ],

          // 📅 Daily views (last 30 days)
          dailyViews: [
            {
              $match: {
                viewedAt: {
                  $gte: new Date(new Date().setDate(new Date().getDate() - 30))
                }
              }
            },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$viewedAt" } },
                count: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } }
          ],

          // 📆 Monthly views (last 12 months)
          monthlyViews: [
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$viewedAt" } },
                count: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } }
          ],

          // 🗺️ Map data
          geoMap: [
            {
              $group: {
                _id: "$country",
                city: { $first: "$city" },
                lat: { $first: "$latitude" },
                lng: { $first: "$longitude" },
                count: { $sum: 1 }
              }
            }
          ]
        }
      }
    ];

    const [result] = await BlogView.aggregate(pipeline);
    res.status(200).json(result);
  } catch (err) {
    console.error("Failed to fetch blog view analytics:", err);
    res.status(500).json({ message: "Failed to fetch analytics", error: err.message });
  }
};



export const getBlogArchives = async (req, res) => {
  try {
    const months = await Blog.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    const archiveList = months.map((item) => ({
      label: new Date(`${item._id}-01`).toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
      value: item._id,
      count: item.count,
    }));

    res.json(archiveList);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch archives" });
  }
};