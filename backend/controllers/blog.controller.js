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

const getAllBlogsOfOneUser = async (req, res) => {
  try {
    let userid = req.params.id;
    let blogs = await Blog.find({ author: userid });
    if (!blogs) {
      return res.status(404).json({ error: "No blogs found" });
    }

    return res.status(200).json({ blogs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAllPublishBlogsOfOneUser = async (req, res) => {
  try {
    let userid = req.params.id;
    let blogs = await Blog.find({ author: userid, published: true });
    if (!blogs) {
      return res.status(404).json({ error: "No blogs found" });
    }

    return res.status(200).json({ blogs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const publishBlog = async (req, res) => {
  let blogId = req.params.id;
  try {
    let userid = req.user._id;
    let blog = await Blog.findOne({ _id: blogId, author: userid });
    if (!blog) {
      return res.status(404).json({ error: "blog not found" });
    }
    if (blog.published) {
      return res.status(400).json({ error: "blog is already pubished" });
    }
    blog.published = true;
    await blog.save();

    return res.status(200).json({ blog, message: "blog is published" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteBlog = async (req, res) => {
  const blogId = req.params.id;
  try {
    let userid = req.user._id;
    let blog = await Blog.findOne({ _id: blogId, author: userid });
    if (!blog) {
      return res.status(404).json({ error: "blog not found" });
    }
    let deleteBlogRef = await blog.deleteOne();
    if (!deleteBlogRef) {
      return res.status(400).json({ error: "Error in delete blog" });
    }

    return res.status(200).json({ message: "blog deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const addOrRemoveLike = async (req, res) => {
  const blogId = req.params.id;
  try {
    const userId = req.user._id;
    let blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "blog not found" });
    }
    const alreadyLiked = blog.likes.some(
      (id) => id.toString() === userId.toString()
    );
    if (alreadyLiked) {
      blog.likes = blog.likes.filter((id) => {
        return id.toString() !== userId.toString();
      });
    } else {
      blog.likes.push(userId);
    }
    blog.likesCount = blog.likes.length;
    await blog.save();

    return res.status(200).json({
      message: alreadyLiked ? "Like removed" : "Blog liked",
      likesCount: blog.likesCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export {
  createBlog,
  getAllBugs,
  getAllBlogsOfOneUser,
  getAllPublishBlogsOfOneUser,
  publishBlog,
  deleteBlog,
  addOrRemoveLike,
};
