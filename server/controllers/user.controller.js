import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Classroom from "../models/classroom.model.js";
import { sendResetEmail } from "../lib/mailer.js"; // Adjust the import path as necessary
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
// Create a new user
export const createUser = async (req, res) => {
  try {
    const { fullName, email, phone, country, role, gender, age, timeZone, password } = req.body;

    // Parse phone if it's sent as a stringified JSON
    const parsedPhone = typeof phone === "string" ? JSON.parse(phone) : phone;

    // ✅ Validation
    if (
      !fullName ||
      !email ||
      !password ||
      !parsedPhone ||
      !parsedPhone.number ||
      !parsedPhone.countryCode ||
      !country ||
      !role ||
      !gender ||
      !age
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    // 🔐 Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 📸 Profile picture path from Cloudinary (uploaded via multer)
    const profilePicUrl = req.file?.path || "";

    // 🧾 Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      phone: {
        countryCode: parsedPhone.countryCode,
        number: parsedPhone.number,
      },
      country,
      gender,
      age,
      role,
      profilePic: profilePicUrl || "",
      timeZone: timeZone || "UTC",
      availability: [],
      isVerified: false,
      isBlocked: false,
      lastLogin: null,
      isOnline: false,
      fcmTokens: [],
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully.", user: newUser });
  } catch (error) {
    console.error("❌ Error in Create User Controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const createFirstPassword = async (req, res) => {
  const { userId } = req.params;
  const { newPassword } = req.body;

  try {
    // 1. Find user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // 2. Check if user already has a password
    if (user.password && user.password.length > 0) {
      return res.status(400).json({ message: "Password has already been set." });
    }

    // 3. Validate new password
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    // 4. Hash and save password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ message: "Password created successfully." });
  } catch (error) {
    console.error("Error in createFirstPassword:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUserPassword = async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    // 1. Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    // 2. Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    // 3. Validate new password (length check)
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters long." });
    }

    // 4. Hash new password and save
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Error updating password:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found." });

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");

    // Set token and expiry (e.g., 1 hour)
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    const resetLink = `http://yourfrontend.com/reset-password?token=${token}&id=${user._id}`;

    await sendResetEmail(user.email, resetLink);

    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    console.error("requestPasswordReset error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resetPasswordWithToken = async (req, res) => {
  const { userId, token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      _id: userId,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear token
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error("resetPasswordWithToken error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Get all users or filter by role
export const getUsers = async (req, res) => {
    try {
        const { role } = req.query; // Extract role from query parameters
        const query = role ? { role } : {}; // If role is provided, filter by role
        const users = await User.find(query);
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


// Get a specific user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



// Update a user by ID
export const updateUser = async (req, res) => {
  const {
    fullName,
    email,
    phone,
    country,
    role,
    gender,
    age,
    timeZone,
  } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });

    //   Parse phone object if it's a string (FormData sends it as stringified JSON)
    let parsedPhone = phone;
    if (typeof phone === "string") {
      try {
        parsedPhone = JSON.parse(phone);
      } catch {
        return res.status(400).json({ message: "Invalid phone data." });
      }
    }

    //   Handle image upload if provided
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "users",
      });

      user.profilePic = result.secure_url; // Update profile picture URL in user object

      // Optionally remove uploaded file from server
      fs.unlinkSync(req.file.path);
    }else{
      user.profilePic = user.profilePic || ""; // Keep existing profile picture if not updated
    }

    // } else if (req.body.removeProfilePic) {
    //   // If the user wants to remove the profile picture
    //   if (user.profilePic) {
    //     const publicId = user.profilePic.split("/").pop().split(".")[0]; // Extract public ID from URL
    //     await cloudinary.uploader.destroy(`users/${publicId}`); // Remove from Cloudinary


    //   Update user fields
    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (parsedPhone) user.phone = parsedPhone;
    if (country) user.country = country;
    if (role) user.role = role;
    if (gender) user.gender = gender;
    if (age) user.age = age;
    if (timeZone) user.timeZone = timeZone;

    await user.save();

    res.status(200).json({ message: "User updated successfully.", user });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a user by ID
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.status(200).json({ message: "User deleted successfully." });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Availability
export const updateUserAvailability = async (req, res) => {
  const { userId, availabilityId } = req.params;
  const { day, hour, isBooked } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const slot = user.availability.id(availabilityId);
    if (!slot) return res.status(404).json({ message: "Availability slot not found" });

    // Prevent editing booked slots
    if (slot.isBooked) return res.status(403).json({ message: "Cannot edit a booked slot" });

    if (day) slot.day = day;
    if (hour) {
      slot.hour = hour;
      slot.period = +hour.split(":")[0] < 12 ? "AM" : "PM"; //   update period based on hour
    }

    if (typeof isBooked === "boolean") {
      // Handle classroom deletion if needed
      if (!isBooked && slot.classroomId) {
        await Classroom.findByIdAndDelete(slot.classroomId);
        slot.classroomId = null;
      }
      slot.isBooked = isBooked;
    }

    await user.save();
    res.status(200).json({ message: "Availability updated", updatedAvailability: slot });
  } catch (err) {
    console.error("Update Availability Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const addUserAvailability = async (req, res) => {
  const { userId } = req.params;
  const { day, hour } = req.body;

  try {
    if (!day || !hour) {
      return res.status(400).json({ message: "Day and hour are required." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const exists = user.availability.some((slot) => slot.day === day && slot.hour === hour);
    if (exists) return res.status(409).json({ message: "This slot already exists." });

    //   Calculate the period from the hour
    const period = +hour.split(":")[0] < 12 ? "AM" : "PM";

    const newSlot = { day, hour, period };
    user.availability.push(newSlot);
    await user.save();

    res.status(201).json({ message: "Slot added successfully", availability: newSlot });
  } catch (err) {
    console.error("Add Availability Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserAvailability = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select("availability");
    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json({
      message: "User availability fetched successfully.",
      availability: user.availability,
    });
  } catch (err) {
    console.error("Get Availability Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteUserAvailability = async (req, res) => {
  const { userId, availabilityId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const slot = user.availability.id(availabilityId);
    if (!slot) return res.status(404).json({ message: "Slot not found." });

    if (slot.isBooked) {
      return res.status(403).json({ message: "Cannot delete a booked slot." });
    }

    // Use remove instead of deleteOne if older mongoose versions
    slot.deleteOne();
    await user.save();

    res.status(200).json({ message: "Slot deleted successfully." });
  } catch (err) {
    console.error("Delete Availability Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// 📍 Add multiple slots at once
export const addUserAvailabilityBulk = async (req, res) => {
  const { userId } = req.params;
  const { day, from, to } = req.body;

  try {
    if (!day || !from || !to) {
      return res.status(400).json({ message: "Day, from, and to are required." });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const slotsToAdd = [];

    const [fromHour, fromMin] = from.split(":").map(Number);
    const [toHour, toMin] = to.split(":").map(Number);

    let current = new Date(0, 0, 0, fromHour, fromMin);
    const end = new Date(0, 0, 0, toHour, toMin);

    while (current <= end) {
      const h = current.getHours().toString().padStart(2, "0");
      const m = current.getMinutes().toString().padStart(2, "0");
      const hour = `${h}:${m}`;
      const period = +h < 12 ? "AM" : "PM";

      const exists = user.availability.some((slot) => slot.day === day && slot.hour === hour);
      if (!exists) {
        slotsToAdd.push({ day, hour, period });
      }

      current.setMinutes(current.getMinutes() + 30); // ⏱️ 30-minute step
    }

    user.availability.push(...slotsToAdd);
    await user.save();

    res.status(201).json({
      message: "Slots added successfully.",
      added: slotsToAdd.length,
      slots: slotsToAdd,
    });
  } catch (err) {
    console.error("Bulk Add Error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


  
// Add FCM Token
export const addFCMToken = async (req, res) => {
  const { userId } = req.params;
  const { device, token } = req.body;

  if (!device || !token) {
    return res.status(400).json({ message: "Device and token are required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if token already exists
    if (user.fcmTokens.some((t) => t.token === token)) {
      return res.status(400).json({ message: "Token already exists for this user" });
    }

    user.fcmTokens.push({ device, token });
    await user.save();

    res.status(200).json({ message: "FCM token added successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove FCM Token
export const removeFCMToken = async (req, res) => {
  const { userId, token } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fcmTokens = user.fcmTokens.filter((t) => t.token !== token);
    await user.save();

    res.status(200).json({ message: "FCM token removed successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};