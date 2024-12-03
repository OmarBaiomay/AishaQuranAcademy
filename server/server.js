import express, { json } from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

config();

const app = express();

// Middleware
app.use(cors());
app.use(json());
app.use(cookieParser());

// Routes
// app.use('/api/auth', require('./routes/authRoutes'));

// MongoDB Connection
connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
