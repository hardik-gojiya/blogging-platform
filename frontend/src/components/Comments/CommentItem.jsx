import { Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { Link } from "react-router-dom";

function CommentItem({
  comment,
  blogAuthorId,
  onReplyClick,
  showReplies,
  toggleReplies,
  deleteComment,
}) {
  const { userId } = useAuth();
  const isAuthor = comment.authorId?._id === blogAuthorId;
  const isOwner = comment.authorId?._id === userId;
  const replies = comment.replies || [];

  return (
    <div className="mt-6">
      {/* Parent Comment */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-white">
          {comment.authorId?.username?.charAt(0)}
        </div>
        <div className="bg-gray-100 p-3 rounded-lg w-full">
          <div className="flex items-center gap-2 ">
            <Link
              to={
                userId === comment.authorId?._id
                  ? "/personal-profile"
                  : `/profile/${comment.authorId?._id}`
              }
              className="font-semibold text-sm hover:underline"
            >
              {comment.authorId?.username || "User"}
            </Link>
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
          <div className="flex justify-between">
            <button
              onClick={() =>
                onReplyClick(comment._id, comment.authorId?.username)
              }
              className="text-xs text-blue-600 hover:underline"
            >
              Reply
            </button>
            {isOwner && (
              <button
                onClick={() => deleteComment(comment._id)}
                className="flex items-center gap-1 cursor-pointer text-red-500 hover:underline text-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
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
                    {reply.authorId?.username?.charAt(0)}
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow w-full">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-blue-700">
                        {reply.authorId?.username || "User"}
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
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">
                        {reply.content}
                      </p>
                      {reply.authorId._id === userId && (
                        <button
                          onClick={() => deleteComment(reply._id)}
                          className="flex items-center gap-1 cursor-pointer text-red-500 hover:underline text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
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
