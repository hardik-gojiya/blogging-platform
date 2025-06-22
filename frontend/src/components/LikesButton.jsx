import React from "react";
import { useAuth } from "../context/AuthContext";
import { useBlog } from "../context/BlogContext";
import { ThumbsUp } from "lucide-react";
import ProtectedRoute from "../hooks/ProtectedRoute";

function LikesButton({ blog }) {
  const { userId } = useAuth();
  const { handleLike } = useBlog();
  return (
    <>
      <button
        onClick={() => handleLike(blog._id)}
        className="flex items-center gap-1 hover:text-blue-600 transition cursor-pointer"
      >
        <ThumbsUp
          className={`w-4 h-4 ${
            blog.likes?.includes(userId) ? "fill-blue-600 text-blue-600" : ""
          }`}
        />
        {blog.likesCount}
      </button>
    </>
  );
}

export default LikesButton;
