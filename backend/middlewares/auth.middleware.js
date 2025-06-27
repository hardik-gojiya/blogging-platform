import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const AuthMiddleware = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // Check for token in cookies or authorization header

  if (!token) {
    return res.status(401).json({ message: "you are not logged in" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.blocked) {
      return res.status(403).json({ error: "Your account has been blocked" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({ error: "Access denied: Admins only" });
    }
    next();
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

export { AuthMiddleware, isAdmin };
