import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: "Stars must be an integer between 1 and 5.",
      },
    },
    opinion: {
      type: String,
      required: true,
      trim: true,
    },
    userImage: {
      type: String,
      default: "", // Optional, use a placeholder image URL if not provided
    },
  },
  { timestamps: true }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);

export default Testimonial;
