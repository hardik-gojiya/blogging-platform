import express from "express";
import {
  chechAuth,
  loginUser,
  logOutUser,
  registerUser,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logOutUser);
router.get("/checkAuth", chechAuth);

export default router;
