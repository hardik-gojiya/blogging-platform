import { useState, useEffect } from "react";
import { api } from "../../services/api";
import LikesButton from "../../components/LikesButton";
import { MessageSquare, Pencil, Trash2, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useBlog } from "../../context/BlogContext";
import { useToast } from "../../hooks/useToast";

function BlogCard({ blog }) {
  const { userId, user } = useAuth();
  const { deleteBlog, handlePublishBlog } = useBlog();
  const { showError } = useToast();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (userId && blog) {
      setIsSaved(blog._id && user?.savedBlogs?.includes(blog._id));
    }
  }, [blog, user]);

  const handleToggleSave = async () => {
    try {
      if (isSaved) {
        await api.delete(`/blog/remove-saved-blog/${blog._id}`);
      } else {
        await api.put(`/blog/save-blog/${blog._id}`);
      }
      setIsSaved((prev) => !prev);
    } catch (err) {
      console.log(err);
      showError("Action failed");
    }
  };

  const stripHtmlTags = (html) => {
    return html.replace(/<[^>]*>?/gm, "");
  };
  const plainText = stripHtmlTags(blog.content);
  const preview = plainText.slice(0, 200);
  return (
    <div
      key={blog._id}
      className="bg-white shadow-md rounded-xl p-6 mb-6 border border-gray-200 hover:shadow-lg transition"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <Link
          to={`/blog/${blog.slug}`}
          className="text-xl sm:text-2xl font-semibold text-gray-800 hover:underline break-words"
        >
          {blog.title}
        </Link>
        <Link
          to={
            userId === blog.author._id
              ? "/personal-profile"
              : `/profile/${blog.author.username}`
          }
          className="text-sm sm:text-base font-medium text-gray-500 hover:underline break-all text-right"
        >
          @{blog.author.username}
        </Link>
      </div>

      <p className="text-gray-700 mt-3 mb-3 break-words whitespace-pre-wrap">
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

      <div className="flex flex-wrap items-center gap-4 text-gray-600 text-sm">
        <LikesButton blog={blog} />

        <Link
          to={`/blog/${blog._id}#comments`}
          className="flex items-center gap-1 hover:text-blue-600"
        >
          <MessageSquare className="w-4 h-4" />
          {blog.commentsCount}
        </Link>

        <button
          onClick={handleToggleSave}
          className="flex items-center gap-1 hover:text-blue-600 transition cursor-pointer"
        >
          <Bookmark
            className={`w-4 h-4 ${
              isSaved ? "fill-gray-600 text-gray-600" : "text-gray-500"
            }`}
          />
          <span className="text-sm">{isSaved ? "Saved" : "Save"}</span>
        </button>

        {userId?.toString() === blog?.author?._id.toString() && (
          <div className="flex flex-wrap gap-2 ml-auto mt-2 sm:mt-0">
            {!blog.published && (
              <button
                onClick={() => handlePublishBlog(blog._id)}
                disabled={blog.published}
                className={`${
                  blog.published
                    ? "bg-green-300 cursor-not-allowed"
                    : "bg-green-500 hover:bg-green-600"
                } text-white px-4 py-2 text-sm rounded`}
              >
                Publish
              </button>
            )}

            <Link
              to={`/edit-Blog/${blog._id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 text-sm rounded flex items-center gap-1"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={() => deleteBlog(blog._id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm rounded flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BlogCard;
