import { useAuth } from "../../context/AuthContext";
import { useBlog } from "../../context/BlogContext";
import BlogCard from "../Blog/BlogCard";
import { Link } from "react-router-dom";
import { Trash2, Upload, Eye } from "lucide-react";
import { useRef } from "react";
import { useToast } from "../../hooks/useToast";
import { api } from "../../services/api";
import { useState } from "react";
import Loader from "../../components/Loader";
import ShowPic from "../../components/ShowPic";

function PersonalProfile() {
  const { islogedin, username, email, userId, profilePic, checkLoggedin } =
    useAuth();
  const { myBlogs } = useBlog();
  const { showSuccess, showError, showConfirm } = useToast();
  const fileInputRef = useRef();
  const [loading, setLoading] = useState(false);
  const [showPic, setShowPic] = useState("");

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
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Profile
      </h1>

      <div className="flex flex-col items-center gap-4 mb-6">
        <img
          src={profilePic || "profilepic.jpeg"}
          alt="Profile"
          className="w-28 h-28 rounded-full border-4 border-gray-300 object-cover shadow-md"
        />

        <div className="flex gap-4">
          <button
            onClick={() => handleDeleteProfilePic()}
            className="p-2 bg-red-100 cursor-pointer hover:bg-red-200 rounded-full text-red-600"
            title="Delete Image"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <button
            onClick={() => fileInputRef.current.click()}
            className="p-2 bg-blue-100 cursor-pointer hover:bg-blue-200 rounded-full text-blue-600"
            title="Update Image"
          >
            <Upload className="w-5 h-5" />
          </button>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={() => setShowPic(profilePic || "/profilepic.jpeg")}
            className="p-2 bg-green-100 cursor-pointer hover:bg-green-200 rounded-full text-green-600"
            title="View Image"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-gray-700 text-lg">
          <span className="font-semibold">Username:</span> {username}
        </p>
        <p className="text-gray-700 text-lg">
          <span className="font-semibold">Email:</span> {email}
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
    </div>
  );
}

export default PersonalProfile;
