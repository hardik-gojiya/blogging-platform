import express from "express";
import { AuthMiddleware, isAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  addProfilePic,
  deleteProfilePic,
  getAllusers,
  toggleBlockUser,
  togglefollowUser,
  toggleNotificationSetting,
  totalUsers,
} from "../controllers/user.controller.js";

const router = express.Router();

router.put(
  "/update-profile-picture/:id",
  AuthMiddleware,
  upload.single("profilepic"),
  addProfilePic
);
router.delete("/remove-profile-picture/:id", AuthMiddleware, deleteProfilePic);
router.put(
  "/toggle-follow-unfollow-user/:id",
  AuthMiddleware,
  togglefollowUser
);

router.get("/all-users", AuthMiddleware, isAdmin, getAllusers);
router.put("/block-unblock/:id", AuthMiddleware, isAdmin, toggleBlockUser);
router.put(
  "/send-notification-toggle/:id",
  AuthMiddleware,
  toggleNotificationSetting
);
router.get("/total-users", AuthMiddleware, isAdmin, totalUsers);

export default router;
