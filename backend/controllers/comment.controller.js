import { Comment } from "../models/comments.model.js";
import { Blog } from "../models/blog.model.js";

const gettotalComments = async (req, res) => {
  return res.json({ totalComments: await Comment.countDocuments() });
};

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
      repliedTo: null,
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
  const { content } = req.body;
  const commentId = req.params.id;
  const userId = req.user._id;

  if (!content) {
    return res.status(400).json({ error: "Comment content is required" });
  }

  try {
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) {
      return res.status(404).json({ error: "Parent comment not found" });
    }

    const reply = new Comment({
      repliedTo: commentId,
      content,
      authorId: userId,
      blogId: parentComment.blogId,
    });

    await reply.save();

    parentComment.replies.push(reply._id);
    await parentComment.save();

    return res.status(201).json({ message: "Reply added", comment: reply });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteComment = async (req, res) => {
  let id = req.params.id;
  let userId = req.user._id;
  try {
    let commentref = await Comment.findOne({
      _id: id,
    });

    if (!commentref) {
      return res.status(400).json({ error: "Comment not found" });
    }
    if (commentref.authorId.toString() !== userId.toString()) {
      return res
        .status(400)
        .json({ error: "You can only delete your Comments" });
    }
    const blogId = commentref.blogId;
    await commentref.deleteOne();
    const updateOps = {
      $pull: { comments: commentref._id },
    };

    if (!commentref.repliedTo) {
      updateOps.$inc = { commentsCount: -1 };
    }

    await Blog.findByIdAndUpdate(blogId, updateOps);
    return res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const fetchCommentsByBlog = async (req, res) => {
  const blogId = req.params.id;
  try {
    let comments = await Comment.find({ blogId: blogId })
      .sort({ createdAt: -1 })
      .populate("repliedTo")
      .populate("blogId", "title slug _id")
      .populate("authorId", "name email profilePic");
    return res.status(200).json({ comments });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  gettotalComments,
  createComment,
  replyToComment,
  deleteComment,
  fetchCommentsByBlog,
};
