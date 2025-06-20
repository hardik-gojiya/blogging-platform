import { Comment } from "../models/comments.model.js";
import { Blog } from "../models/blog.model.js";

const createComment = async (req, res) => {
  const { content } = req.body;
  const blogId = req.params.id;
  const userId = req.user._id;
  if (!content) {
    return res.status(400).json({ error: "Comment content is required" });
  }
  try {
    let blog = await Blog.findOne({ _id: blogId });
    if (!blog) {
      return res.status(400).json({ error: "Blog not Found" });
    }
    let commentRef = new Comment({
      content,
      authorId: userId,
      blogId: blog._id,
    });
    if (!commentRef) {
      return res.status(400).json({ error: "Error in comment" });
    }

    let pushref = blog.comments.push(commentRef._id);
    blog.commentsCount = blog.comments.length;

    if (pushref) {
      await blog.save();
      await commentRef.save();
    }
    return res.status(201).json({ message: "Comment Sucessfull", commentRef });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const replyToComment = async (req, res) => {
  const { content, commentId } = req.body;
  const blogId = req.params.id;
  const userId = req.user._id;
  if (!content) {
    return res.status(400).json({ error: "Comment content is required" });
  }
  try {
    let blog = await Blog.findOne({ _id: blogId });
    if (!blog) {
      return res.status(400).json({ error: "Blog not Found" });
    }
    let commentRef = new Comment({
      repliedTo: commentId,
      content,
      authorId: userId,
      blogId: blog,
    });
    if (!commentRef) {
      return res.status(400).json({ error: "Error in comment" });
    }

    let pushref = blog.comments.push(commentRef);
    blog.commentsCount = blog.comments.length;

    if (pushref) {
      await blog.save();
      await commentRef.save();
    }
    return res.status(201).json({ message: "Comment Sucessfull", commentRef });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export { createComment, replyToComment };
