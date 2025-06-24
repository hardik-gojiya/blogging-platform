import express from "express";
import {
  addOrRemoveLike,
  createBlog,
  deleteBlog,
  editBlog,
  getAllBlogsOfOneUser,
  getAllBugs,
  getAllPublishBlogsOfOneUser,
  getBlogById,
  publishBlog,
} from "../controllers/blog.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/createBlog", AuthMiddleware, createBlog);
router.get("/getAllBlogs", getAllBugs);
router.get("/getBlogById/:id", getBlogById);
router.get("/getAllBlogsofOneUser/:id", AuthMiddleware, getAllBlogsOfOneUser);
router.get("/getAllPublishBlogsOfOneUser/:id", getAllPublishBlogsOfOneUser);
router.put("/publishBlog/:id", AuthMiddleware, publishBlog);
router.delete("/deleteBlog/:id", AuthMiddleware, deleteBlog);
router.put("/editBlog/:id", AuthMiddleware, editBlog);
router.post("/like-unlikeBlog/:id", AuthMiddleware, addOrRemoveLike);

export default router;
