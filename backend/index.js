import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.use("/", (req, res) => {
  res.end(`${PORT}`);
});

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
