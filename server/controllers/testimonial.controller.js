import Testimonial from "../models/testimonial.model.js";

export const createTestimonial = async (req, res) => {
    const { userName, stars, opinion, userImage } = req.body;
  
    try {
      // Validate required fields
      if (!userName || !stars || !opinion) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      // Create a new testimonial
      const testimonial = new Testimonial({ userName, stars, opinion, userImage });
      await testimonial.save();
  
      res.status(201).json({
        message: "Testimonial created successfully.",
        testimonial,
      });
    } catch (error) {
      console.error("Error creating testimonial:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  export const getAllTestimonials = async (req, res) => {
    try {
      const testimonials = await Testimonial.find().sort({ createdAt: -1 });
      res.status(200).json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  export const getTestimonialById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const testimonial = await Testimonial.findById(id);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found." });
      }
      res.status(200).json(testimonial);
    } catch (error) {
      console.error("Error fetching testimonial:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  export const updateTestimonial = async (req, res) => {
    const { id } = req.params;
    const { userName, stars, opinion, userImage } = req.body;
  
    try {
      const testimonial = await Testimonial.findById(id);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found." });
      }
  
      if (userName) testimonial.userName = userName;
      if (stars) testimonial.stars = stars;
      if (opinion) testimonial.opinion = opinion;
      if (userImage) testimonial.userImage = userImage;
  
      await testimonial.save();
  
      res.status(200).json({
        message: "Testimonial updated successfully.",
        testimonial,
      });
    } catch (error) {
      console.error("Error updating testimonial:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  export const deleteTestimonial = async (req, res) => {
    const { id } = req.params;
  
    try {
      const testimonial = await Testimonial.findByIdAndDelete(id);
      if (!testimonial) {
        return res.status(404).json({ message: "Testimonial not found." });
      }
  
      res.status(200).json({ message: "Testimonial deleted successfully." });
    } catch (error) {
      console.error("Error deleting testimonial:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  