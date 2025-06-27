import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";
import slugify from "slugify";

const gettotalBlogs = async (req, res) => {
  return res.json({ totalBlogs: await Blog.countDocuments() });
};

const createBlog = async (req, res) => {
  const { title, slug, content, tags, published } = req.body;
  const userId = req.user._id;

  if (!title || !content || !tags?.length || published === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    let baseSlug = slugify(slug || title, { lower: true, strict: true });
    let trySlug = baseSlug;

    let tempSlug = baseSlug;
    for (let i = 0; i < tags.length; i++) {
      tempSlug += `-${slugify(tags[i], { lower: true, strict: true })}`;
      const exists = await Blog.findOne({ slug: tempSlug });
      if (!exists) {
        trySlug = tempSlug;
        break;
      }
    }

    if (await Blog.findOne({ slug: trySlug })) {
      let count = 1;
      let numberedSlug = trySlug;
      while (await Blog.findOne({ slug: numberedSlug })) {
        numberedSlug = `${trySlug}-${count++}`;
      }
      trySlug = numberedSlug;
    }

    const blog = new Blog({
      title,
      slug: trySlug,
      content,
      tags,
      published,
      author: user._id,
    });

    await blog.save();

    return res.status(201).json({
      message: "Blog created successfully",
      slug: trySlug,
      blog,
    });
  } catch (err) {
    console.error("Error in creating blog:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getAllBugs = async (req, res) => {
  try {
    let blogs = await Blog.find({ published: true })
      .sort({ createdAt: -1 })
      .populate("author", "email username profilePic")
      .populate({
        path: "comments",
        populate: [
          {
            path: "authorId",
            select: "username email profilePic",
          },
          {
            path: "replies",
            populate: {
              path: "authorId",
              select: "username email profilePic",
            },
          },
        ],
      });
    if (!blogs) {
      return res.status(404).json({ error: "No blogs found" });
    }

    return res.status(200).json({ blogs });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getBlogById = async (req, res) => {
  const blogId = req.params.id;
  try {
    let blog = await Blog.findById(blogId)
      .populate("author", "email username profilePic")
      .populate({
        path: "comments",
        populate: [
          {
            path: "authorId",
            select: "username email profilePic",
          },
          {
            path: "replies",
            populate: {
              path: "authorId",
              select: "username email profilePic",
            },
          },
        ],
      });

    if (!blog) {
      return res.status(404).json({ error: "blog not found" });
    }

    return res.status(200).json({ blog });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getBlogBySlug = async (req, res) => {
  const slug = req.params.slug;
  try {
    let blog = await Blog.findOne({ slug })
      .populate("author", "email username profilePic")
      .populate({
        path: "comments",
        populate: [
          {
            path: "authorId",
            select: "username email profilePic",
          },
          {
            path: "replies",
            populate: {
              path: "authorId",
              select: "username email profilePic",
            },
          },
        ],
      });

    if (!blog) {
      return res.status(404).json({ error: "blog not found" });
    }

    return res.status(200).json({ blog });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getAllBlogsOfOneUser = async (req, res) => {
  try {
    let userid = req.params.id;
    let blogs = await Blog.find({ author: userid })
      .sort({ createdAt: -1 })
      .populate("author", "email username profilePic")
      .populate({
        path: "comments",
        populate: [
          {
            path: "authorId",
            select: "username email profilePic",
          },
          {
            path: "replies",
            populate: {
              path: "authorId",
              select: "username email profilePic",
            },
          },
        ],
      });
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
    let user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    let blogs = await Blog.find({ author: userid, published: true })
      .sort({ createdAt: -1 })
      .populate("author", "email username profilePic following followers")
      .populate({
        path: "comments",
        populate: [
          {
            path: "authorId",
            select: "username email profilePic following followers",
          },
          {
            path: "replies",
            populate: {
              path: "authorId",
              select: "username email profilePic following followers",
            },
          },
        ],
      });
    if (!blogs) {
      return res.status(404).json({ error: "No blogs found" });
    }

    return res.status(200).json({ user, blogs });
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

const editBlog = async (req, res) => {
  const blogId = req.params.id;
  const { title, content, tags, published } = req.body;

  const slugify = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    if (req.user._id.toString() !== blog.author.toString()) {
      return res.status(403).json({ error: "Unauthorized to edit this blog" });
    }

    const newSlug = slugify(title);
    if (newSlug !== blog.slug) {
      const existing = await Blog.findOne({
        slug: newSlug,
        _id: { $ne: blogId },
      });
      if (existing) {
        return res.status(409).json({
          error: "Slug already exists. Try changing the title slightly.",
        });
      }
      blog.slug = newSlug;
    }

    blog.title = title;
    blog.content = content;
    blog.tags = tags;
    blog.published = published;

    await blog.save();

    return res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  gettotalBlogs,
  createBlog,
  getAllBugs,
  getBlogById,
  getBlogBySlug,
  getAllBlogsOfOneUser,
  getAllPublishBlogsOfOneUser,
  publishBlog,
  deleteBlog,
  addOrRemoveLike,
  editBlog,
};
