import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";
import {
  deletFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.util.js";

const editUserProfile = async (req, res) => {
  const userId = req.user._id;
  const { username, email, bio } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (username) user.username = username;
    if (email) user.email = email;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const editBio = async (req, res) => {
  const userId = req.user._id;
  const { bio } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: "User not found" });

    user.bio = bio || user.bio;

    await user.save();

    return res
      .status(200)
      .json({ message: "Profile updated successfully", bio: user.bio });
  } catch (err) {
    console.error("Error updating profile:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

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

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("username email followers following profilePic")
      .populate("following", "username profilePic")
      .populate("followers", "username profilePic");

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

const toggleNotificationSetting = async (req, res) => {
  const userid = req.params.id;

  try {
    let user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.allowNotification = !user.allowNotification;
    await user.save();
    return res
      .status(200)
      .json({ message: "Status Updated", status: user.allowNotification });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUserAndBlogs = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    await Blog.deleteMany({ author: userId });

    await User.findByIdAndDelete(userId);

    await User.updateMany(
      { followers: userId },
      { $pull: { followers: userId } }
    );
    await User.updateMany(
      { following: userId },
      { $pull: { following: userId } }
    );

    return res.status(200).json({ message: "User and all blogs deleted" });
  } catch (err) {
    console.error("Error deleting user and blogs:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchSavedBlogs = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).populate({
      path: "savedBlogs",
      populate: {
        path: "author",
        select: "username profilePic",
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ savedBlogs: user.savedBlogs });
  } catch (error) {
    console.error("Error fetching saved blogs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getPopularUsers = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ followers: -1 }) // this doesn't work as expected since it's an array
      .lean();

    // manually sort based on followers length
    const sorted = users
      .map((user) => ({
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        followers: user.followers || [],
        followersCount: user.followers?.length || 0,
      }))
      .sort((a, b) => b.followersCount - a.followersCount)
      .slice(0, 5); // limit to top 5

    res.status(200).json({ users: sorted });
  } catch (error) {
    console.error("Error fetching popular users", error);
    res.status(500).json({ error: "Failed to fetch popular users" });
  }
};

export {
  addProfilePic,
  deleteProfilePic,
  togglefollowUser,
  getUserDetails,
  getAllusers,
  toggleBlockUser,
  totalUsers,
  toggleNotificationSetting,
  deleteUserAndBlogs,
  fetchSavedBlogs,
  getPopularUsers,
  editUserProfile,
  editBio,
};
