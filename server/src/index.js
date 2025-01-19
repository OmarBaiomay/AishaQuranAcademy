import express, { json } from 'express';
import dotenv from "dotenv"
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from "../lib/db.js";
import authRoutes from "../routes/auth.routes.js"
import classroomRoutes from "../routes/classroom.routes.js";
import userRoutes from "../routes/user.routes.js";
import testimonialRoutes from "../routes/testimonial.routes.js";
import courseRoutes from "../routes/course.routes.js";

const app = express();

dotenv.config()

// Middleware
app.use(json());
app.use(cookieParser());
app.use(cors({
        origin: "http://localhost:5173",
        credentials: true,
    }
));
const PORT = process.env.PORT
// Middleware to parse cookies
app.use(express.json());


app.use("/api/auth", authRoutes)
app.use("/api", classroomRoutes)
app.use("/api", userRoutes)
app.use("/api", testimonialRoutes);
app.use("/api", courseRoutes);

app.listen(PORT, () =>{
    console.log(`Server Is Runing on ${PORT}`)
    connectDB();
});