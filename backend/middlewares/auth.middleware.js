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

    req.user = user; // Attach user to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
export { AuthMiddleware };
