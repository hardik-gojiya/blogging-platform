import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";
import slugify from "slugify";
import { sendMail } from "../utils/sendMail.util.js";

const gettotalBlogs = async (req, res) => {
  return res.json({ totalBlogs: await Blog.countDocuments() });
};

const sendMailOfBlog = async (user, blog) => {
  const followers = user.followers || [];

  for (let follower of followers) {
    let sendinfo = await sendMail({
      to: follower.email,
      subject: `${user.username} posted new Blog!`,
      html: `
          <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f4f4; padding: 30px;">
  <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
    
    <div style="background-color: #4f46e5; color: white; padding: 20px 30px;">
      <h2 style="margin: 0;"> New Blog by ${user.username}</h2>
    </div>

    <div style="padding: 20px 30px;">
      <h3 style="color: #333; font-size: 22px; margin-bottom: 10px;">${
        blog.title
      }</h3>

      <p style="color: #555; font-size: 16px; line-height: 1.6;">
        ${blog.content.slice(0, 200)}...
      </p>

      <div style="margin-top: 20px; text-align: center;">
        <a href="#" style="display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; transition: background 0.3s;">
           Read Full Blog
        </a>
      </div>
    </div>

    <div style="padding: 16px 30px; background-color: #f9f9f9; color: #999; font-size: 13px; text-align: center;">
      You’re receiving this email because you follow <strong>${
        user.username
      }</strong>.
      <br />
      <a href="#" style="color: #4f46e5;">Manage Notification Settings</a>
    </div>
  </div>
</div>

          `,
    });
  }
};

const generateUniqueSlug = async (title, slug, tags) => {
  let baseSlug = slugify(slug || title, { lower: true, strict: true });
  let trySlug = baseSlug;

  for (let i = 0; i < tags.length; i++) {
    const tempSlug = `${baseSlug}-${slugify(tags[i], {
      lower: true,
      strict: true,
    })}`;
    if (!(await Blog.findOne({ slug: tempSlug }))) {
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

  return trySlug;
};

const createBlog = async (req, res) => {
  const { title, slug, content, tags, published } = req.body;
  const userId = req.user._id;

  if (!title || !content || !tags?.length || published === undefined) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "followers",
        match: { allowNotification: true },
        select: "email username",
      });
    if (!user) return res.status(404).json({ error: "User not found" });

    const trySlug = await generateUniqueSlug(title, slug, tags);

    const blog = new Blog({
      title,
      slug: trySlug,
      content,
      tags,
      published,
      author: user._id,
    });

    await blog.save();

    res.status(201).json({
      message: "Blog created successfully",
      slug: trySlug,
      blog,
    });
    if (!published) {
      return;
    }
    setTimeout(async () => {
      sendMailOfBlog(user, blog);
    }, 0);
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

const fetchBlogByPageNumber = async (req, res) => {
  const pageNo = parseInt(req.params.page) || 1;
  const limit = 10;
  const skip = (pageNo - 1) * limit;

  try {
    const blogs = await Blog.find({ published: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
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
      })
      .lean();

    const totalBlogs = await Blog.countDocuments({ published: true });

    return res.status(200).json({
      blogs,
      currentPage: pageNo,
      totalBlogs,
      totalPages: Math.ceil(totalBlogs / limit),
    });
  } catch (error) {
    console.error("Error fetching paginated blogs:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
      .populate("author", "email username profilePic bio")
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
    let username = req.params.username;
    let user = await User.findOne({ username: username })
      .select("username email profilePic followers following")
      .populate("followers", "username email profilePic")
      .populate("following", "username email profilePic");
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    let blogs = await Blog.find({ author: user._id, published: true })
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
    const user = await User.findById(userid)
      .select("-password")
      .populate({
        path: "followers",
        match: { allowNotification: true },
        select: "email username",
      });
    let blog = await Blog.findOne({ _id: blogId, author: userid });
    if (!blog) {
      return res.status(404).json({ error: "blog not found" });
    }
    if (blog.published) {
      return res.status(400).json({ error: "blog is already pubished" });
    }
    blog.published = true;
    await blog.save();

    res.status(200).json({ blog, message: "blog is published" });
    sendMailOfBlog(user, blog);
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

const saveBlog = async (req, res) => {
  const userId = req.user._id;
  const blogId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.savedBlogs.includes(blogId)) {
      return res.status(400).json({ message: "Blog already saved" });
    }

    user.savedBlogs.push(blogId);
    await user.save();

    res.status(200).json({
      message: "Blog saved successfully",
      savedBlogs: user.savedBlogs,
    });
  } catch (error) {
    console.error("Error saving blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const removeSaveBlog = async (req, res) => {
  const userId = req.user._id;
  const blogId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.savedBlogs = user.savedBlogs.filter((id) => id.toString() !== blogId);
    await user.save();

    res.status(200).json({
      message: "Blog removed from saved",
      savedBlogs: user.savedBlogs,
    });
  } catch (error) {
    console.error("Error removing saved blog:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
  saveBlog,
  removeSaveBlog,
  fetchBlogByPageNumber,
};
