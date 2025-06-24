import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Pencil, Trash2, MessageSquare, ThumbsUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";
import { api } from "../services/api";
import { useBlog } from "../context/BlogContext";

function Profile() {
  const { id: profileId } = useParams();
  const { showError } = useToast();
  const { islogedin, userId } = useAuth();
  const { handleLike, deleteBlog, handlePublishBlog } = useBlog();

  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  const isOwnProfile = userId === profileId;

  useEffect(() => {
    if (profileId) {
      fetchUser();
    }
  }, [profileId]);

  const fetchUser = async () => {
    try {
      const res = await api.get(
        `/blog/getAllPublishBlogsOfOneUser/${profileId}`
      );
      if (res.status === 200) {
        setBlogs(res.data.blogs);
        setUser(res.data.user);
      }
    } catch (error) {
      console.error(error);
      setBlogs([]);
      setUser(null);
      showError("Something went wrong");
    }
  };

  const handleLikeClick = async (id) => {
    const updated = await handleLike(id);
    if (updated) {
      setBlogs((prev) => prev.map((b) => (b._id === id ? updated : b)));
    }
  };

  const stripHtml = (html) => html.replace(/<[^>]*>?/gm, "");

  if (!islogedin) {
    return (
      <div className="text-center text-red-500 text-lg font-semibold mt-10">
        Unauthorized - Please{" "}
        <Link to="/login" className="underline">
          login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile</h1>
      <p className="text-gray-600 mb-1">
        Name: <span className="font-medium">{user?.username}</span>
      </p>
      <p className="text-gray-600 mb-4">
        Email: <span className="font-medium">{user?.email}</span>
      </p>
      <hr className="mb-6" />

      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Published Blogs
      </h2>

      {blogs.length === 0 ? (
        <p className="text-gray-500">Blogs not found.</p>
      ) : (
        <div className="space-y-6">
          {blogs.map((blog) => {
            const plainText = stripHtml(blog.content);
            const preview = plainText.slice(0, 200);

            return (
              <div
                key={blog._id}
                className="bg-white shadow-md rounded-xl p-6 mb-6 border border-gray-200 hover:shadow-lg transition"
              >
                <div className="flex justify-between">
                  <Link
                    to={`/blog/${blog._id}`}
                    className="text-2xl font-semibold text-gray-800 mb-2 hover:underline"
                  >
                    {blog.title}
                  </Link>
                  <span className="font-semibold text-gray-400 mb-2">
                    {blog.author.username}
                  </span>
                </div>

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

                <div className="flex items-center gap-4 text-gray-600 text-sm flex-wrap">
                  <div className="flex items-center gap-1 hover:text-blue-600 cursor-pointer">
                    <Link to={`/blog/${blog._id}#comments`}>
                      <MessageSquare className="w-4 h-4" />
                    </Link>
                    {blog.commentsCount}
                  </div>

                  {isOwnProfile && (
                    <div className="flex items-center gap-2 ml-auto">
                      {!blog.published && (
                        <button
                          onClick={() => handlePublishBlog(blog._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm rounded"
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
          })}
        </div>
      )}
    </div>
  );
}

export default Profile;
