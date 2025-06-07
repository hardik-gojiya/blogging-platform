import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { connectDB } from "./db/db.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

connectDB();

import authRoutes from "./routes/auth.route.js";
app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
