import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import admin from "../utils/firebaseAdmin.js";

const generateToken = (user) => {
  return jwt.sign({ id: user?._id, role: user?.role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
function generateRandomPassword(length = 8) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
}

const checkUserName = async (req, res) => {
  const { name } = req.body;
  try {
    let username = await User.findOne({ username: name });
    if (username) {
      return res.status(400).json({ message: "Username not available" });
    }
    return res.status(200).json({ message: "Username Available" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const registerUser = async (req, res) => {
  const { name: username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "all fields are require" });
  }
  try {
    const hashedPass = await bcrypt.hash(password, 10);
    if (!hashedPass) {
      return res.status(500).json({ error: "internal server error" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "user already exists" });
    }

    let newUser = await new User({
      username,
      email,
      password: hashedPass,
    });

    if (!newUser) {
      return res.status(400).json({ error: "error in register" });
    }
    await newUser.save();
    const token = generateToken(newUser);

    res.cookie("token", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
      httpOnly: true,
      secure: false,
    });

    return res.status(201).json({ message: "register successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "all fields are require" });
  }

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }
    if (user.blocked) {
      return res.status(403).json({ error: "Your account has been blocked" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000, //30 days
      httpOnly: true,
      secure: false,
    });

    return res.status(200).json({ message: "login successfull", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const logOutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
    });
    return res.status(200).json({ message: "logout successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const chechAuth = async (req, res) => {
  let token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "You are not loggedin" });
  }

  let decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedToken) {
    return res.status(404).json({ error: "Token not Found" });
  }

  let user = await User.findOne({ _id: decodedToken.id })
    .select("-password")
    .populate("followers", "username email profilePic")
    .populate("following", "username email profilePic");
  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  return res.status(200).json({
    userId: user._id,
    username: user.username,
    email: user.email,
    bio: user.bio,
    profilePic: user.profilePic,
    role: user.role,
    blocked: user.blocked,
    followers: user.followers,
    following: user.following,
    allowNotification: user.allowNotification,
    savedBlogs: user.savedBlogs,
  });
};

const googleLoginUser = async (req, res) => {
  const { token: tokenId } = req.body;

  if (!tokenId) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(tokenId);
    const { email, picture } = decodedToken;

    let user = await User.findOne({ email });

    if (!user) {
      const password = generateRandomPassword();
      const hashedPassword = await bcrypt.hash(password, 10);

      const baseUsername = email.split("@")[0].toLowerCase();
      let username = baseUsername;
      let count = 1;

      while (await User.findOne({ username })) {
        username = `${baseUsername}${count}`;
        count++;
      }

      user = await User.create({
        email,
        username,
        profilePic: picture,
        password: hashedPassword,
      });
    }

    const token = generateToken(user);

    res.cookie("token", token, {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      httpOnly: true,
      secure: false,
    });

    return res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    console.error("Google login error", error);
    res.status(401).json({ message: "Invalid Firebase token" });
  }
};

export {
  checkUserName,
  registerUser,
  loginUser,
  logOutUser,
  chechAuth,
  googleLoginUser,
};
