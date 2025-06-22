import express, { Router } from "express";
import {
  createComment,
  deleteComment,
  fetchCommentsByBlog,
  replyToComment,
} from "../controllers/comment.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/Create-Comment/:id", AuthMiddleware, createComment);
router.post("/reply-to-Comment/:id", AuthMiddleware, replyToComment);
router.delete("/delete-Comment/:id", AuthMiddleware, deleteComment);
router.get("/fetch-Comments-By-Blog/:id", fetchCommentsByBlog);

export default router;
