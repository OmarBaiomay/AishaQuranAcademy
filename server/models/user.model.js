import mongoose from "mongoose";

const fcmTokenSchema = new mongoose.Schema({
  device: { type: String, required: true },
  token: { type: String, required: true },
});

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    gender: { type: String, required: true, enum: ["Male", "Female"] },
    age: { type: Number, min: 0, required: true, default: 0 },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: "" },
    role: { type: String, required: true, enum: ["Student", "Teacher", "Supervisor", "Administrator"], default: "Student" },
    phone: {
      countryCode: { type: String, required: true },
      number: { type: String, required: true, validate: (v) => /^\d+$/.test(v) },
    },
    country: { type: String, required: true },
    timeZone: { type: String, required: true, default: "UTC" },
    availability: { type: Array, default: [] },
    fcmTokens: [fcmTokenSchema],
    // ✅ Ensure one classroom per student
    classroomId: { type: mongoose.Schema.Types.ObjectId, ref: "Classroom", unique: true, sparse: true, required: false, default: null }, 
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
