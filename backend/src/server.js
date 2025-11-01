import express from "express";
import mongoose from "mongoose";
import authUser from './routes/auth.route.js'
import postRoutes from './routes/post.route.js'
import cors from 'cors'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express();
const PORT = process.env.PORT || 4500;
const MONGODB_URI = process.env.MONGO_URI || "mongodb://localhost:27017/social_web_app";


app.use(express.json())
app.get("/", (req, res) => {
  res.json({
    message:"ok"
  });
});

app.use(cors())
app.use("/api/auth", authUser);
app.use("/api/posts", postRoutes);

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

// 404 handler
app.use((req, res, next) => {
  const err = new Error("route is not found");
  err.status = 404;
  next(err);
});

// error-handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error"
  });
});

app.listen(PORT, () => console.log(`server is running on ${PORT}`));
