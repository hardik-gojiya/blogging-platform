import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

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
    const token = generateToken(user);

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
    profilePic: user.profilePic,
    role: user.role,
    blocked: user.blocked,
    followers: user.followers,
    following: user.following,
    allowNotification: user.allowNotification,
  });
};

export { checkUserName, registerUser, loginUser, logOutUser, chechAuth };
