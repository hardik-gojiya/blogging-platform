import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    let conn = await mongoose.connect(process.env.MONGO_URI);
    if (conn) {
      console.log(`mongodb connected, host: ${conn.connection.host}`);
    }
  } catch (error) {
    console.log("error while connecting database: ", error);
  }
};

export { connectDB };
