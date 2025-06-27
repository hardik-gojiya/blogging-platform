import express from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addProfilePic } from "../controllers/user.controller.js";

const router = express.Router();

router.put(
  "/update-profile-picture/:id",
  AuthMiddleware,
  upload.single("profilepic"),
  addProfilePic
);

export default router;
