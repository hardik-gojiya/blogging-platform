import { User } from "../models/user.model.js";
import {
  deletFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.util.js";

const addProfilePic = async (req, res) => {
  const profilepic = req.file?.path;
  const paramsid = req.params.id;
  const userId = req.user._id;
  if (paramsid.toString() !== userId.toString()) {
    return res.status(400).json({ error: "You can only update your profile" });
  }
  try {
    let user = await User.findById(userId);

    let cloudImage = await uploadOnCloudinary(profilepic);

    if (!cloudImage) {
      return res.status(400).json({ error: "Image upload error" });
    }
    await deletFromCloudinary(user.profilePic);
    user.profilePic = cloudImage.secure_url;
    await user.save();
    return res
      .status(200)
      .json({ message: "Profile picture updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const deleteProfilePic = async (req, res) => {
  const paramsid = req.params.id;
  const userId = req.user._id;
  if (paramsid.toString() !== userId.toString()) {
    return res.status(400).json({ error: "You can only update your profile" });
  }
  try {
    let user = await User.findById(userId);
    if (user.profilePic === null) {
      return res.status(400).json({ error: "Already Deleted" });
    }
    await deletFromCloudinary(user.profilePic);
    user.profilePic = null;
    await user.save();
    return res
      .status(200)
      .json({ message: "Profile picture removed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const togglefollowUser = async (req, res) => {
  const { currentUserId } = req.body;
  const targetUserId = req.params.id;

  try {
    if (currentUserId.toString() !== req.user._id.toString()) {
      return res.status(400).json({ error: "Invalid Credential" });
    }

    const currentUser = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const isFollowing = currentUser.following.includes(
      targetUser._id.toString()
    );

    if (!isFollowing) {
      targetUser.followers.push(currentUser._id);
      currentUser.following.push(targetUser._id);

      await targetUser.save();
      await currentUser.save();

      return res.status(200).json({ message: "Followed successfully" });
    } else {
      targetUser.followers = targetUser.followers.filter(
        (id) => id.toString() !== currentUser._id.toString()
      );
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== targetUser._id.toString()
      );

      await targetUser.save();
      await currentUser.save();

      return res.status(200).json({ message: "Unfollowed successfully" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const unFollowUser = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "username email followers following profilePic"
    );
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: "User not found" });
  }
};

const getAllusers = async (req, res) => {
  try {
    let users = await User.find();
    if (!users) {
      return res.status(404).json({ error: "Users not found" });
    }
    return res.status(200).json({ users });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const toggleBlockUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    user.blocked = !user.blocked;
    await user.save();

    return res.status(200).json({
      message: `User has been ${user.blocked ? "blocked" : "unblocked"}`,
      blocked: user.blocked,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const totalUsers = async (req, res) => {
  return res.json({ totalUsers: await User.countDocuments() });
};

export {
  addProfilePic,
  deleteProfilePic,
  togglefollowUser,
  unFollowUser,
  getUserDetails,
  getAllusers,
  toggleBlockUser,
  totalUsers,
};
