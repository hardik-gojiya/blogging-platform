import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { connectDB } from "./config/db.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

connectDB();

import authRoutes from "./routes/auth.route.js";
app.use("/api/v1/auth", authRoutes);

import userRoutes from "./routes/user.route.js";
app.use("/api/v1/user", userRoutes);

import blogRoutes from "./routes/blog.route.js";
app.use("/api/v1/blog", blogRoutes);

import commentRoutes from "./routes/comment.route.js";
app.use("/api/v1/comment", commentRoutes);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
