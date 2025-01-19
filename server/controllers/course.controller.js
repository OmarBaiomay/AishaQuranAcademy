import Course from "../models/course.model.js";

export const createCourse = async (req, res) => {
    const { title, about, content, forAdults, forKids } = req.body;
  
    try {
      // Create a new course document
      const newCourse = new Course({
        title,
        about,
        content: JSON.parse(content), // Parse stringified content array
        forAdults: forAdults === "true", // Convert string to boolean
        forKids: forKids === "true", // Convert string to boolean
        image: req.file ? req.file.path : "", // Use Cloudinary image URL
      });
  
      // Save to database
      const savedCourse = await newCourse.save();
  
      res.status(201).json({
        message: "Course created successfully",
        course: savedCourse,
      });
    } catch (error) {
      console.error("Error creating course:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
export const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });
        res.status(200).json(courses);
    } catch (error) {
        console.error("Error fetching courses:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getCourseById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const course = await Course.findById(id);
      if (!course) {
        return res.status(404).json({ message: "Course not found." });
      }
      res.status(200).json(course);
    } catch (error) {
      console.error("Error fetching course:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  export const updateCourse = async (req, res) => {
    const { id } = req.params;
    const { title, about, image, content, forAdults, forKids } = req.body;
  
    try {
      const course = await Course.findById(id);
      if (!course) {
        return res.status(404).json({ message: "Course not found." });
      }
  
      if (title) course.title = title;
      if (about) course.about = about;
      if (image) course.image = image;
      if (content) course.content = content;
      if (typeof forAdults === "boolean") course.forAdults = forAdults;
      if (typeof forKids === "boolean") course.forKids = forKids;
  
      await course.save();
  
      res.status(200).json({
        message: "Course updated successfully.",
        course,
      });
    } catch (error) {
      console.error("Error updating course:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  export const deleteCourse = async (req, res) => {
    const { id } = req.params;
  
    try {
      const course = await Course.findByIdAndDelete(id);
      if (!course) {
        return res.status(404).json({ message: "Course not found." });
      }
  
      res.status(200).json({ message: "Course deleted successfully." });
    } catch (error) {
      console.error("Error deleting course:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  