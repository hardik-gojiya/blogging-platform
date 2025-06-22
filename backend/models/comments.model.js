import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    repliedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    content: {
      type: String,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

commentSchema.pre("findOneAndDelete", async function (next) {
  const comment = await this.model.findOne(this.getFilter());

  async function deleteReplies(commentId) {
    const replies = await mongoose
      .model("Comment")
      .find({ repliedTo: commentId });
    for (const reply of replies) {
      await deleteReplies(reply._id); // recursively delete children
      await mongoose.model("Comment").deleteOne({ _id: reply._id });
    }
  }

  if (comment) {
    await deleteReplies(comment._id);
  }

  next();
});

export const Comment = new mongoose.model("Comment", commentSchema);
