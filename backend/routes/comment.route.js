import express, { Router } from "express";
import {
  createComment,
  deleteComment,
  fetchCommentsByBlog,
  gettotalComments,
  replyToComment,
} from "../controllers/comment.controller.js";
import { AuthMiddleware, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/get-total-comments", AuthMiddleware, isAdmin, gettotalComments);
router.post("/Create-Comment/:id", AuthMiddleware, createComment);
router.post("/reply-to-Comment/:id", AuthMiddleware, replyToComment);
router.delete("/delete-Comment/:id", AuthMiddleware, deleteComment);
router.get("/fetch-Comments-By-Blog/:id", fetchCommentsByBlog);

export default router;
