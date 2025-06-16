import express from "express";
import { createBlog, getAllBugs } from "../controllers/blog.controller.js";
import { AuthMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/createBlog", AuthMiddleware, createBlog);
router.get("/getAllBlogs", getAllBugs);

export default router;
