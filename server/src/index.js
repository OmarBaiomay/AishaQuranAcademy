import express, { json } from 'express';
import dotenv from "dotenv"
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from "../lib/db.js";
import authRoutes from "../routes/auth.routes.js"
import classroomRoutes from "../routes/classroom.routes.js";

const app = express();

dotenv.config()
// Middleware
app.use(cors());
app.use(json());
app.use(cookieParser());
const PORT = process.env.PORT

// Middleware to parse cookies
app.use(cookieParser());

app.use(express.json());


app.use("/api/auth", authRoutes)
app.use("/api", classroomRoutes)


app.listen(PORT, () =>{
    console.log(`Server Is Runing on ${PORT}`)
    connectDB();
});