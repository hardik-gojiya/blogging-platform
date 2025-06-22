import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useBlog } from "../context/BlogContext";
import { MessageSquare, ThumbsUp, Trash2 } from "lucide-react";

function Profile() {
  const { islogedin, name, email, handleLogOut, userId } = useAuth();
  const { myBlogs, handleLike, handlePublishBlog, deleteBlog } = useBlog();

  if (!islogedin) {
    return (
      <div className="text-center text-red-500 text-lg font-semibold mt-10">
        Unauthorized - Please login
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile</h1>
      <p className="text-gray-600 mb-1">
        Name: <span className="font-medium">{name}</span>
      </p>
      <p className="text-gray-600 mb-4">
        Email: <span className="font-medium">{email}</span>
      </p>
      <hr className="mb-6" />

      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Blogs</h2>

      {myBlogs.length === 0 ? (
        <p className="text-gray-500">You haven't written any blogs yet.</p>
      ) : (
        <div className="space-y-6">
          {myBlogs.map((blog) => (
            <div
              key={blog._id}
              className="border border-gray-200 p-4 rounded-lg shadow-sm bg-white"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {blog.title}
              </h3>
              <div
                className="text-gray-700 text-sm prose max-w-none mb-2 break-words whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html:
                    blog.content.length > 200
                      ? blog.content.slice(0, 200) + "..."
                      : blog.content,
                }}
              ></div>

              <div className="flex flex-wrap gap-2 mb-2">
                {blog.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                <button
                  onClick={() => {
                    handleLike(blog._id);
                  }}
                  className="flex items-center gap-1 hover:text-blue-600 transition cursor-pointer"
                >
                  <ThumbsUp
                    className={`w-4 h-4 ${
                      blog.likes?.includes(userId)
                        ? "fill-blue-600 text-blue-600"
                        : ""
                    }`}
                  />
                  {blog.likesCount}
                </button>

                <div className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {blog.commentsCount}
                </div>

                <span className="ml-auto text-xs text-gray-400">
                  {blog.published ? "Published" : "Draft"}
                </span>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Link
                  to={`/blog/${blog._id}`}
                  className="bg-gray-200 hover:bg-gray-300 text-sm px-4 py-2 rounded"
                >
                  View Blog
                </Link>

                <button
                  onClick={() => handlePublishBlog(blog._id)}
                  disabled={blog.published}
                  className={`${
                    blog.published
                      ? "bg-green-300 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  } text-white px-4 py-2 text-sm rounded`}
                >
                  {blog.published ? "Published" : "Publish"}
                </button>

                <button
                  onClick={() => deleteBlog(blog._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm rounded"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
