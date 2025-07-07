import { useAuth } from "../../context/AuthContext";
import { useBlog } from "../../context/BlogContext";
import BlogCard from "../Blog/BlogCard";
import { Link } from "react-router-dom";
import {
  Trash2,
  Upload,
  Eye,
  Settings,
  BookmarkCheck,
  Pencil,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { useToast } from "../../hooks/useToast";
import { api } from "../../services/api";
import { useState } from "react";
import Loader from "../../components/Loader";
import ShowPic from "../../components/ShowPic";

function PersonalProfile() {
  const {
    islogedin,
    username,
    email,
    userId,
    profilePic,
    checkLoggedin,
    followers,
    following,
    user,
  } = useAuth();
  const { myBlogs } = useBlog();
  const { showSuccess, showError, showConfirm } = useToast();
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [showPic, setShowPic] = useState("");
  const [showListType, setShowListType] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState("");
  useEffect(() => {
    if (islogedin) {
      setBio(user?.bio || "");
    }
  }, [user]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    showConfirm({
      message: "Do you want to Change profile picture?",
      onOk: async () => {
        const formData = new FormData();
        formData.set("profilepic", file);
        if (file) {
          setLoading(true);
          try {
            let res = await api.put(
              `/user/update-profile-picture/${userId}`,
              formData
            );
            if (res.status === 200) {
              showSuccess(res.data?.message || "Picture updated successfully");
              await checkLoggedin();
            }
          } catch (error) {
            showError(error?.response?.data?.error || "Something went wrong");
          } finally {
            setLoading(false);
          }
        }
      },
      onCancel: () => {},
    });
  };

  const handleDeleteProfilePic = async () => {
    showConfirm({
      message: "Do you want to remove profile picture?",
      onOk: async () => {
        setLoading(true);
        try {
          let res = await api.delete(`/user/remove-profile-picture/${userId}`);
          if (res.status === 200) {
            showSuccess(res.data?.message || "Picture updated successfully");
            await checkLoggedin();
          }
        } catch (error) {
          showError(error?.response?.data?.error || "Something went wrong");
        } finally {
          setLoading(false);
        }
      },
      onCancel: () => {},
    });
  };

  const handleToggleFollow = async (id) => {
    try {
      const res = await api.put(`/user/toggle-follow-unfollow-user/${id}`, {
        currentUserId: userId,
      });
      if (res.status === 200) {
        checkLoggedin();
      }
    } catch (error) {
      console.error(error);
      showError("Follow action failed");
    }
  };

  const handleBioUpdate = async () => {
    try {
      const res = await api.put("/user/edit-bio", { bio });
      showSuccess(res.data?.message || "Bio updated successfully");
      await checkLoggedin();
      setIsEditingBio(false);
    } catch (error) {
      showError(error?.response?.data?.error || "Failed to update bio");
    }
  };

  if (!islogedin) {
    return (
      <div className="text-center text-red-500 text-lg font-semibold mt-10">
        Unauthorized - Please{" "}
        <Link to={"/login"} className="underline">
          login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Loader loading={loading} />
      <div className="flex justify-end gap-2 mb-4">
        <Link
          to="/saved-blogs"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200  rounded-lg shadow-sm transition text-sm"
          title="Saved Blogs"
        >
          <BookmarkCheck className="w-5 h-5" />
        </Link>

        <Link
          to="/profile/settings"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200  rounded-lg shadow-sm transition text-sm"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </Link>
      </div>

      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Profile
      </h1>

      <div className="flex flex-col items-center gap-4 mb-8">
        <img
          src={profilePic || "profilepic.jpeg"}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover shadow-lg"
        />

        <div className="flex gap-4">
          <button
            onClick={handleDeleteProfilePic}
            className="p-2 bg-red-100 hover:bg-red-200 rounded-full text-red-600 shadow-sm"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => fileInputRef.current.click()}
            className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full text-blue-600 shadow-sm"
            title="Upload"
          >
            <Upload className="w-5 h-5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => setShowPic(profilePic || "/profilepic.jpeg")}
            className="p-2 bg-green-100 hover:bg-green-200 rounded-full text-green-600 shadow-sm"
            title="View"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="text-center mb-8 space-y-1">
        <p className="text-xl font-semibold text-gray-800">
          Username: <span className="font-medium">{username}</span>
        </p>
        <p className="text-md text-gray-600">Email: {email}</p>
        <div className="flex justify-center items-center gap-2 mt-1">
          {isEditingBio ? (
            <>
              <input
                type="text"
                className="border px-3 py-1 text-sm rounded w-full max-w-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <button
                onClick={handleBioUpdate}
                className="text-sm text-blue-600 hover:underline"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditingBio(false);
                  setBio(user?.bio || "");
                }}
                className="text-sm text-gray-500 hover:text-red-500"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600 max-w-xl text-center">
                {bio || "No bio added."}
              </p>
              <button
                onClick={() => setIsEditingBio(true)}
                className="text-gray-400 hover:text-blue-600"
                title="Edit Bio"
              >
                <Pencil className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-6 text-gray-700 text-lg mb-8">
        <p
          className="cursor-pointer hover:underline"
          onClick={() => setShowListType("followers")}
        >
          <span className="font-bold">{followers?.length || 0}</span> Followers
        </p>
        <p
          className="cursor-pointer hover:underline"
          onClick={() => setShowListType("following")}
        >
          <span className="font-bold">{following?.length || 0}</span> Following
        </p>
      </div>

      <hr className="mb-6" />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">Your Blogs</h2>
        <Link
          to="/my-blogs"
          className="text-blue-600 font-medium hover:underline"
        >
          See All
        </Link>
      </div>

      {myBlogs.length === 0 ? (
        <p className="text-gray-500">
          Haven't written any blogs yet.{" "}
          <Link to={"/Create-Blog"} className="text-blue-500 underline">
            Create Blog
          </Link>
        </p>
      ) : (
        <div className="space-y-6">
          {myBlogs.slice(0, 10).map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
      {showPic && <ShowPic url={showPic} onCancel={() => setShowPic("")} />}
      {showListType && (
        <>
          <div
            onClick={() => setShowListType("")}
            className="fixed inset-0 z-30 backdrop-blur-md"
          />
          <div className="absolute top-36 left-1/2 -translate-x-1/2 z-40 bg-white rounded-xl shadow-lg w-[90vw] sm:w-80 max-h-[70vh] overflow-y-auto p-4 border transition-all">
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

            {(showListType === "followers" ? followers : following).length ===
            0 ? (
              <p className="text-gray-500 text-sm text-center">
                No {showListType} found.
              </p>
            ) : (
              <ul className="space-y-3">
                {(showListType === "followers" ? followers : following).map(
                  (person) => (
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
                      {showListType === "following" && (
                        <button
                          onClick={() => handleToggleFollow(person._id)}
                          className="text-sm text-red-500 px-2 py-1 hover:underline"
                        >
                          Unfollow
                        </button>
                      )}
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default PersonalProfile;
