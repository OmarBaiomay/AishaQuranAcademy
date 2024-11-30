import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { firstName, lastName, password, email, phone, country, role } = req.body;

    try {
        // Validate required fields
        if (!firstName || !lastName || !password || !email || !phone || !country || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        // Validate phone number format
        if (!/^[0-9]{10,15}$/.test(phone)) {
            return res.status(400).json({ message: "Invalid phone number format" });
        }

        // Validate role
        const allowedRoles = ["Student", "Teacher", "Supervisor", "Administrator"];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ message: `Invalid role. Allowed roles are: ${allowedRoles.join(", ")}` });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);

        // Create the new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashPass,
            phone,
            country,
            role,
        });

        // Save the user and automatically assign country code
        await newUser.save();

        // Generate token and respond
        generateToken(newUser._id, res);

        res.status(201).json({
            _id: newUser._id,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phone: newUser.phone,
            country: newUser.country,
            countryCode: newUser.countryCode,
            role: newUser.role,
        });
    } catch (error) {
        console.error("Error in Sign Up Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const login = (req, res) =>{
    res.send("Login")
};

export const logout = (req, res) =>{
    res.send("Log Out")
};