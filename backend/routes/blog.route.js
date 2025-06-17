import express from "express";
import {
  addOrRemoveLike,
  createBlog,
  deleteBlog,
  getAllBlogsOfOneUser,
  getAllBugs,
  publishBlog,
} from "../controllers/blog.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/createBlog", AuthMiddleware, createBlog);
router.get("/getAllBlogs", getAllBugs);
router.get("/getAllBlogsofOneUser", AuthMiddleware, getAllBlogsOfOneUser);
router.put("/publishBlog/:id", AuthMiddleware, publishBlog);
router.delete("/deleteBlog/:id", AuthMiddleware, deleteBlog);
router.post("/like-unlikeBlog/:id", AuthMiddleware, addOrRemoveLike);

export default router;
