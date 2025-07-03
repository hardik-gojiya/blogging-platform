import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Pencil, Trash2, MessageSquare } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import { api } from "../../services/api";
import { useBlog } from "../../context/BlogContext";
import ShowPic from "../../components/ShowPic";

function Profile() {
  const navigate = useNavigate();
  const { username: username } = useParams();
  const { showError } = useToast();
  const { islogedin, userId, username: ownusername } = useAuth();
  const { handleLike, deleteBlog, handlePublishBlog } = useBlog();

  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showPic, setShowPic] = useState("");
  const [showListType, setShowListType] = useState("");

  const isOwnProfile = ownusername === username;

  const fetchUser = async () => {
    try {
      const res = await api.get(
        `/blog/getAllPublishBlogsOfOneUser/${username}`
      );
      if (res.status === 200) {
        setBlogs(res.data.blogs);
        setUser(res.data.user);
        if (
          res.data.user.followers?.some(
            (f) => f._id?.toString() === userId?.toString()
          )
        ) {
          setIsFollowing(true);
        } else {
          setIsFollowing(false);
        }
      }
    } catch (error) {
      console.error(error);
      setBlogs([]);
      setUser(null);
      showError("Something went wrong");
    }
  };

  const handleToggleFollow = async () => {
    try {
      const res = await api.put(
        `/user/toggle-follow-unfollow-user/${user._id}`,
        {
          currentUserId: userId,
        }
      );
      if (res.status === 200) {
        setIsFollowing((prev) => !prev);
      }
    } catch (error) {
      console.error(error);
      showError("Follow action failed");
    } finally {
      fetchUser();
    }
  };

  useEffect(() => {
    if (username) {
      fetchUser();
    }
  }, [username]);

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
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-6">
        <div className="flex items-center gap-6 flex-wrap">
          <img
            src={user?.profilePic || "/profilepic.jpeg"}
            alt="Profile"
            onClick={() => setShowPic(user?.profilePic)}
            className="rounded-full w-20 h-20 border-2 border-gray-300 shadow cursor-pointer hover:opacity-80 transition"
          />
          <div className="space-y-1">
            <p className="text-gray-700 text-lg">
              Name: <span className="font-semibold">{user?.username}</span>
            </p>
            <p className="text-gray-600 text-sm">
              Email: <span className="font-medium">{user?.email}</span>
            </p>
            <div className="flex gap-4 text-gray-700 text-lg">
              <p
                className="cursor-pointer hover:underline"
                onClick={() => setShowListType("followers")}
              >
                <span className="font-semibold">{user?.followers?.length}</span>{" "}
                Followers
              </p>
              <p
                className="cursor-pointer hover:underline"
                onClick={() => setShowListType("following")}
              >
                <span className="font-semibold">{user?.following?.length}</span>{" "}
                Following
              </p>
            </div>
          </div>
        </div>

        {!isOwnProfile && (
          <div className="sm:mt-0 mt-2">
            <button
              onClick={handleToggleFollow}
              className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400 text-sm transition"
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </button>
          </div>
        )}
      </div>

      <hr className="mb-6" />

      {/* Published Blogs Section */}
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
                className="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <Link
                    to={`/blog/${blog._id}`}
                    className="text-2xl font-semibold text-gray-800 hover:underline"
                  >
                    {blog.title}
                  </Link>
                  <span className="font-semibold text-gray-400 text-sm">
                    {blog.author.username}
                  </span>
                </div>

                <p className="text-gray-700 mt-2 mb-3 whitespace-pre-wrap">
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
      {showPic && <ShowPic url={showPic} onCancel={() => setShowPic("")} />}
      {showListType && (
        <>
          <div
            onClick={() => setShowListType("")}
            className="fixed inset-0 z-30 backdrop-blur-md"
          />

          <div className="absolute top-36 left-1/2 -translate-x-1/2 z-40 bg-white rounded-xl shadow-lg w-[90vw] sm:w-80 max-h-[70vh] overflow-y-auto p-4 border transition-all duration-200 ease-in-out transform scale-95">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold capitalize">
                {showListType}
              </h2>
              <button
                onClick={() => setShowListType("")}
                className="text-gray-500 hover:text-red-600"
              >
                ✕
              </button>
            </div>

            {user?.[showListType]?.length === 0 ? (
              <p className="text-gray-500 text-sm text-center">
                No {showListType} found.
              </p>
            ) : (
              <ul className="space-y-3">
                {user[showListType].map((person) => (
                  <li key={person._id} className="flex items-center gap-3">
                    <img
                      src={person.profilePic}
                      alt={person.username}
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                    <div>
                      <p
                        onClick={() => {
                          navigate(
                            person._id === userId
                              ? "/personal-profile"
                              : `/profile/${person.username}`
                          );
                          setShowListType("");
                        }}
                        className="font-medium hover:underline cursor-pointer"
                      >
                        {person.username}
                      </p>
                      <p className="text-sm text-gray-500">{person.email}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;
