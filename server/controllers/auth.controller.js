import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bycrypt from "bcryptjs"

export const signup = async (req, res) =>{

    const {firstName, lastName, password, email} = req.body

    try {
        if(!firstName || !lastName || !password || !email){
            return res.status(400).json({message: "All fields Must are Required"});
        }
        if(password.length < 6){
            return res.status(400).json({message: "Password must be at least 6 charcaters"});
        }

        const user = await User.findOne({email})

        if (user) return res.status(400).json({message: "Email already exists!!"})
        
        const salt = await  bycrypt.genSalt(10)
        
        const hashPass = await bycrypt.hash(password, salt)

        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashPass
        })

        if(newUser){
            generateToken(newUser._id, res)
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                password: newUser.hashPass
            })
        }else{
            return res.status(400).json({message: "Envalid User Data"})
        }
        
    } catch (error) {
        console.log("Error In Sign Up Controller", error.message);
        res.status(500).json({message: "Internel Server Error"})

    }
};

export const login = (req, res) =>{
    res.send("Login")
};

export const logout = (req, res) =>{
    res.send("Log Out")
};