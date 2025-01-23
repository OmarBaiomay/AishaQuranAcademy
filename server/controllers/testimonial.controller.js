import Testimonial from "../models/testimonial.model.js";

// Create a new testimonial
export const createTestimonial = async (req, res) => {
  const { userName, stars, opinion } = req.body;

  try {
    // Validate required fields
    if (!userName || !stars || !opinion) {
      return res.status(400).json({ message: "All fields (userName, stars, opinion) are required." });
    }

    // Create a new testimonial
    const newTestimonial = new Testimonial({
      userName,
      stars: parseInt(stars, 10), // Ensure stars is an integer
      opinion,
      userImage: req.file ? req.file.path : "", // Use uploaded image if provided
    });

    // Save to the database
    const savedTestimonial = await newTestimonial.save();

    res.status(201).json({
      message: "Testimonial created successfully.",
      testimonial: savedTestimonial,
    });
  } catch (error) {
    console.error("Error creating testimonial:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get all testimonials
export const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 }); // Latest first
    res.status(200).json(testimonials);
  } catch (error) {
    console.error("Error fetching testimonials:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a single testimonial by ID
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

// Update a testimonial
export const updateTestimonial = async (req, res) => {
  const { id } = req.params;
  const { userName, stars, opinion } = req.body;

  try {
    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found." });
    }

    // Update fields
    if (userName) testimonial.userName = userName;
    if (stars) testimonial.stars = parseInt(stars, 10); // Ensure stars is an integer
    if (opinion) testimonial.opinion = opinion;
    if (req.file) testimonial.userImage = req.file.path; // Update the image if provided

    // Save updated testimonial
    const updatedTestimonial = await testimonial.save();

    res.status(200).json({
      message: "Testimonial updated successfully.",
      testimonial: updatedTestimonial,
    });
  } catch (error) {
    console.error("Error updating testimonial:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a testimonial
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
