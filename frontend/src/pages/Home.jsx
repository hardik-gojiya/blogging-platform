import React from "react";
import { Link } from "react-router-dom";
import { useBlog } from "../context/BlogContext";
import { MessageSquare, ThumbsUp, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LikesButton from "../components/LikesButton";

function Home() {
  const { userId } = useAuth();
  const { allBlogs, handleLike, deleteBlog } = useBlog();

  const stripHtmlTags = (html) => {
    return html.replace(/<[^>]*>?/gm, "");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-wrap">
      <h2 className="text-xl font-semibold text-gray-600 mb-6">All Blogs</h2>

      {allBlogs.length === 0 ? (
        <p className="text-gray-500">No Blogs found</p>
      ) : (
        allBlogs.map((blog) => {
          const isLiked = blog.likes?.includes(userId);
          const plainText = stripHtmlTags(blog.content);
          const preview = plainText.slice(0, 200);

          return (
            <div
              key={blog._id}
              className="bg-white shadow-md rounded-xl p-6 mb-6 border border-gray-200 hover:shadow-lg transition"
            >
              <Link
                to={`/blog/${blog._id}`}
                className="text-2xl font-semibold text-gray-800 mb-2 hover:underline"
              >
                {blog.title}
              </Link>

              <p className="text-gray-700 mb-3 break-words whitespace-pre-wrap">
                {preview}
                {plainText.length > 200 && (
                  <Link
                    to={`/blog/${blog._id}`}
                    className="text-blue-600 hover:underline ml-2 text-sm"
                  >
                    Show more
                  </Link>
                )}
              </p>

              <ul className="flex flex-wrap gap-2 text-sm text-blue-600 mb-4">
                {blog.tags.map((tag, idx) => (
                  <li
                    key={idx}
                    className="bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition cursor-pointer"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>

              <div className="flex items-center gap-4 text-gray-600 text-sm">
                <LikesButton blog={blog} />

                <div className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                  <MessageSquare className="w-4 h-4" />
                  {blog.commentsCount}
                </div>

                {userId?.toString() === blog.author._id.toString() && (
                  <button
                    onClick={() => deleteBlog(blog._id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-600 transition cursor-pointer ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Home;
