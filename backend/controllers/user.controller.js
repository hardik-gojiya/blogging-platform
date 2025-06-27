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

export { addProfilePic };
