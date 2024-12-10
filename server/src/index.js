import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { connectDB } from "../lib/db.js";
import authRoutes from "../routes/auth.routes.js"

const app = express();

dotenv.config()
const PORT = process.env.PORT

// Middleware to parse cookies
app.use(cookieParser());

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes)

app.listen(PORT, () =>{
    console.log(`Server Is Runing on ${PORT}`)
    connectDB();
});