import express from "express";
import {
  chechAuth,
  checkUserName,
  googleLoginUser,
  loginUser,
  logOutUser,
  registerUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/google", googleLoginUser);
router.post("/check-user-name", checkUserName);
router.post("/login", loginUser);
router.post("/logout", logOutUser);
router.get("/checkAuth", chechAuth);

export default router;
