import React, { useState } from "react";
import CommentItem from "./CommentItem";

function CommentList({
  comments = [],
  blogAuthorId,
  onReplyClick,
  deleteComment,
}) {
  const [visibleReplies, setVisibleReplies] = useState({});

  const toggleReplies = (id) => {
    setVisibleReplies((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet. Be the first!</p>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            blogAuthorId={blogAuthorId}
            onReplyClick={onReplyClick}
            showReplies={visibleReplies[comment._id]}
            toggleReplies={toggleReplies}
            deleteComment={deleteComment}
          />
        ))
      )}
    </div>
  );
}

export default CommentList;
