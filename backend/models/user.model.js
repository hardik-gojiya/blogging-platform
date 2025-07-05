import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    profilePic: {
      type: String,
      default:
        "https://res.cloudinary.com/hardikgojiya/image/upload/v1751003778/defaultprofilepic_iwthr3.jpg",
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    blocked: {
      type: Boolean,
      default: false,
    },
    allowNotification: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const User = new mongoose.model("Users", userSchema);
