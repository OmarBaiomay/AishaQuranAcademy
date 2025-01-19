import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// Create a new user
export const createUser = async (req, res) => {
    const { fullName, email, password, phone, country, role, availability, gender, age } = req.body;

    try {
        // Validate required fields
        if (!fullName || !email || !password || !phone || !country || !role || !gender || !age) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists." });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            phone,
            country,
            gender,
            age,
            role,
            availability,
        });

        // Save the user
        await newUser.save();

        res.status(201).json({ message: "User created successfully.", user: newUser });
    } catch (error) {
        console.error("Error in Create User Controller:", error.message);
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
    const { fullName, email, phone, country, role, availability, gender, age } = req.body;

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
        if (availability) user.availability = availability;

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

        // Save the updated teacher
        await teacher.save();

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
  