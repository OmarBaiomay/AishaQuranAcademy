import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import Classroom from "../models/classroom.model.js";
import { sendResetEmail } from "../lib/mailer.js"; // Adjust the import path as necessary

// Create a new user
export const createUser = async (req, res) => {
  const { fullName, email, phone, country, role, gender, age, timeZone } = req.body;

  try {
      // Validate required fields
      if (!fullName || !email || !phone || !country || !role || !gender || !age) {
          return res.status(400).json({ message: "All fields are required." });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ message: "Email already exists." });
      }

      // Create the new user
      const newUser = new User({
          fullName,
          email,
          phone: {
            countryCode: phone.countryCode,
            number: phone.number,
          },
          country,
          gender,
          age,
          role,
          availability : [], // Initialize with an empty array 
          isVerified: false,
          isBlocked: false,
          lastLogin: null,
          profilePic: "", // Default profile picture or set it to a placeholder
          isOnline: false,
          fcmTokens: [], // Initialize with an empty array 
          timeZone: timeZone || "UTC", // Default to UTC if not provided
        });

      // Save the user
      await newUser.save();

      res.status(201).json({ message: "User created successfully.", user: newUser });
  } catch (error) {
      console.error("Error in Create User Controller:", error.message);
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
  const { fullName, email, phone, country, role, gender, age, timeZone } = req.body;

  try {
      const user = await User.findById(req.params.id);

      if (!user) {
          return res.status(404).json({ message: "User not found." });
      }

      // Update fields if provided
      if (fullName) user.fullName = fullName;
      if (email) user.email = email;
      if (phone) user.phone = phone;
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

// Updating Availability
export const updateUserAvailability = async (req, res) => {
    const { userId, availabilityId } = req.params;
    const { day, hour, period, isBooked } = req.body;

    try {
        // Find the teacher by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the specific availability slot by its ID
        const availability = user.availability.id(availabilityId);

        if (!availability) {
            return res.status(404).json({ message: "Availability slot not found." });
        }

        // If marking as not booked, delete the connected classroom
        if (typeof isBooked === "boolean" && !isBooked && availability.classroomId) {
            await Classroom.findByIdAndDelete(availability.classroomId);
            // Clear the classroomId
            availability.classroomId = null;
        }

        // Update the availability fields
        if (day) availability.day = day;
        if (hour) availability.hour = hour;
        if (period) availability.period = period;
        if (typeof isBooked === "boolean") availability.isBooked = isBooked;

        // Save the updated user
        await user.save();

        res.status(200).json({
            message: "User availability updated successfully.",
            updatedAvailability: availability,
        });
    } catch (error) {
        console.error("Error updating user availability:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const addUserAvailability = async (req, res) => {
    const { userId } = req.params;
    const { day, hour, period } = req.body;
  
    try {
      // Validate input
      if (!day || !hour || !period) {
        return res.status(400).json({ message: "Day, hour, and period are required." });
      }
  
      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Add the new availability slot
      const newAvailability = { day, hour, period };
      user.availability.push(newAvailability);
  
      await user.save();
  
      res.status(201).json({
        message: "Availability added successfully.",
        availability: newAvailability,
      });
    } catch (error) {
      console.error("Error adding availability:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  export const getUserAvailability = async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Find the user
      const user = await User.findById(userId).select("availability");
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      res.status(200).json({
        message: "User availability retrieved successfully.",
        availability: user.availability,
      });
    } catch (error) {
      console.error("Error fetching availability:", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  export const deleteUserAvailability = async (req, res) => {
    const { userId, availabilityId } = req.params;
  
    try {
      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Find and remove the availability slot
      const availabilityIndex = user.availability.findIndex(
        (slot) => slot._id.toString() === availabilityId
      );
  
      if (availabilityIndex === -1) {
        return res.status(404).json({ message: "Availability slot not found." });
      }
  
      user.availability.splice(availabilityIndex, 1);
      await user.save();
  
      res.status(200).json({ message: "Availability deleted successfully." });
    } catch (error) {
      console.error("Error deleting availability:", error.message);
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