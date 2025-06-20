import express, { Router } from "express";
import {
  createComment,
  replyToComment,
} from "../controllers/comment.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/Create-Comment/:id", AuthMiddleware, createComment);
router.post("/reply-to-Comment/:id", AuthMiddleware, replyToComment);

export default router;
