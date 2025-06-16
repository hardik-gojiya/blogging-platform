import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";

const createBlog = async (req, res) => {
  const { title, slug, content, tags, published } = req.body;
  let userid = req.user._id;

  if (!title || !slug || !content || !tags || published === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    let user = await User.findOne({ _id: userid }).select("-password");
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    let blog = new Blog({
      title,
      slug,
      author: user,
      content,
      tags,
      published,
    });
    if (!blog) {
      return res.status(400).json({ error: "Error in creating Blog" });
    }
    await blog.save();
    return res.status(201).json({ message: "Blog created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAllBugs = async (req, res) => {
  try {
    let blogs = await Blog.find({ published: true });
    if (!blogs) {
      return res.status(404).json({ error: "No blogs found" });
    }

    return res.status(200).json({ blogs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export { createBlog, getAllBugs };
