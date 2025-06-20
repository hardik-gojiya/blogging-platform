import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  return token;
};

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
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
      name,
      email,
      password: hashedPass,
    });

    if (!newUser) {
      return res.status(400).json({ error: "error in register" });
    }
    await newUser.save();

    return res.status(201).json({ message: "register successfully" });
  } catch (error) {
    return res.status(500).json({ error: "internal server error" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "all fields are require" });
  }

  try {
    const user = await User.findOne({ email }).select("-password");
    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }

    const token = generateToken(user._id);

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

  let user = await User.findOne({ _id: decodedToken.id }).select("-password");
  if (!user) {
    return res.status(404).json({ error: "user not found" });
  }

  return res.status(200).json({
    userId: user._id,
    name: user.name,
    email: user.email,
  });
};

export { registerUser, loginUser, logOutUser, chechAuth };
