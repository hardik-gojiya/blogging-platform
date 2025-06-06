import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import { connectDB } from "./db/db.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

connectDB();

app.use("/", (req, res) => {
  res.end(`${PORT}`);
});
import authRoutes from "./routes/auth.route.js";
app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
