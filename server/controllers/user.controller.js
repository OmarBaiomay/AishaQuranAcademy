import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// Create a new user
export const createUser = async (req, res) => {
    const { fullName, email, password, phone, country, role, availability, gender } = req.body;

    try {
        // Validate required fields
        if (!fullName || !email || !password || !phone || !country || !role || !gender) {
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
            role,
            availability, // Include availability only for Teachers
        });

        // Save the user
        await newUser.save();

        res.status(201).json({ message: "User created successfully.", user: newUser });
    } catch (error) {
        console.error("Error in Create User Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Get all users
export const getUsers = async (req, res) => {
    try {
        const users = await User.find();
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
    const { fullName, email, phone, country, role, availability, gender } = req.body;

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
        if (gender) user.role = gender;

        // Update availability only if role is Teacher
        if (role === "Teacher" && availability) {
            user.availability = availability;
        }

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
export const updateTeacherAvailability = async (req, res) => {
    const { teacherId, availabilityId } = req.params;
    const { day, hour, period, isBooked } = req.body;

    try {
        // Find the teacher by ID
        const teacher = await User.findById(teacherId);

        if (!teacher || teacher.role !== "Teacher") {
            return res.status(404).json({ message: "Teacher not found or invalid role." });
        }

        // Find the specific availability slot by its ID
        const availability = teacher.availability.id(availabilityId);

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
            message: "Teacher availability updated successfully.",
            updatedAvailability: availability,
        });
    } catch (error) {
        console.error("Error updating teacher availability:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};