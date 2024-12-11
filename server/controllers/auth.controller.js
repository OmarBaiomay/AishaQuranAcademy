import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const {
        firstName,
        lastName,
        password,
        email,
        phone,
        country,
        role,
        availability, // Include availability for Teacher role
    } = req.body;

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
            return res
                .status(400)
                .json({ message: `Invalid role. Allowed roles are: ${allowedRoles.join(", ")}` });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already exists!" });
        }

        // If role is Teacher, validate availability
        if (role === "Teacher") {
            if (!Array.isArray(availability)) {
                return res.status(400).json({ message: "Availability must be an array." });
            }

            // Validate each availability slot
            for (const slot of availability) {
                if (
                    !slot.day ||
                    !slot.hour ||
                    !slot.period ||
                    !["AM", "PM"].includes(slot.period) ||
                    ![
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday",
                    ].includes(slot.day)
                ) {
                    return res
                        .status(400)
                        .json({ message: "Each availability slot must have a valid day, hour, and period." });
                }
            }
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
            availability: role === "Teacher" ? availability : [], // Set availability for Teacher role
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
            availability: newUser.availability, // Include availability in the response
        });
    } catch (error) {
        console.error("Error in Sign Up Controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const login = async (req, res) =>{
    const {email, password} = req.body;
    
    try {

        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message: "Invalid Credentials"})
        }
        
        const isPassCorrect = await bcrypt.compare(password, user.password)

        if(!isPassCorrect){
            return res.status(400).json({message: "Invalid Credentials"})
        }

        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profilePic: user.profilePic
        })

    } catch (error) {
        console.log("Error in login Controller", error.message)
    }
};

export const logout = (req, res) =>{
    try {
        res.cookie("jwt_token", "", {maxAge:0})
        res.status(200).json({message: "Logged out Successfully"})
    } catch (error) {
        console.log("Error in logout Controller", error.message)
    }
};

export const updateProfile = async (req, res) =>{
    try {
        const {profilePic} = req.body

        const userId =  req.user._id

        if(!profilePic){
            return res.status(400).json({message: "Profile pic is required"});
        }

        const uploadRes = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadRes.secure_url
        }, {new: true})

        return res.status(200).json(updatedUser);
        
    } catch (error) {
        console.log("Error in Update Profile Controller", error.message)
        return res.status(500).json({message: "Internal Server Error"});
    }
};