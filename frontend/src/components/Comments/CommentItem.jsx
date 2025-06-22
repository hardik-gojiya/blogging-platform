import React from "react";

function CommentItem({
  comment,
  blogAuthorId,
  onReplyClick,
  showReplies,
  toggleReplies,
}) {
  const isAuthor = comment.authorId?._id === blogAuthorId;
  const replies = comment.replies || [];

  return (
    <div className="mt-6">
      {/* Parent Comment */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-white">
          {comment.authorId?.name?.charAt(0)}
        </div>
        <div className="bg-gray-100 p-3 rounded-lg w-full">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">
              {comment.authorId?.name || "User"}
            </span>
            {isAuthor && (
              <span className="text-xs bg-gray-700 text-white px-2 py-0.5 rounded-full">
                Author
              </span>
            )}
            <span className="text-xs text-gray-500 ml-auto">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-gray-800 whitespace-pre-wrap mt-1 mb-2">
            {comment.content}
          </p>
          <button
            onClick={() => onReplyClick(comment._id, comment.authorId?.name)}
            className="text-xs text-blue-600 hover:underline"
          >
            Reply
          </button>
        </div>
      </div>

      {/* Show Replies Button */}
      {replies.length > 0 && (
        <div className="ml-10 mt-2">
          <button
            onClick={() => toggleReplies(comment._id)}
            className="text-xs text-blue-600 hover:underline"
          >
            {showReplies ? "Hide Replies" : `Show ${replies.length} Reply(ies)`}
          </button>

          {/* Replies */}
          {showReplies && (
            <div className="border-l-2 border-gray-300 pl-4 mt-3 space-y-3">
              {replies.map((reply) => (
                <div key={reply._id} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-white">
                    {reply.authorId?.name?.charAt(0)}
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow w-full">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-blue-700">
                        {reply.authorId?.name || "User"}
                      </span>
                      {reply.authorId?._id === blogAuthorId && (
                        <span className="text-xs bg-gray-700 text-white px-2 py-0.5 rounded-full">
                          Author
                        </span>
                      )}
                      <span className="text-xs text-gray-500 ml-auto">
                        {new Date(reply.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">
                      {reply.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CommentItem;
