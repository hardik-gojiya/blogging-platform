import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useBlog } from "../../context/BlogContext";
import BlogCard from "../Blog/BlogCard";
import { Link } from "react-router-dom";

function PersonalProfile() {
  const { islogedin, username, email, userId } = useAuth();
  const { myBlogs } = useBlog();

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
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile</h1>
      <p className="text-gray-600 mb-1">
        Name: <span className="font-medium">{username}</span>
      </p>
      <p className="text-gray-600 mb-4">
        Email: <span className="font-medium">{email}</span>
      </p>
      <hr className="mb-6" />

      <div className="flex justify-between">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Your Blogs
        </h2>
        <Link to={"/my-blogs"} className="  text-blue-500 underline mb-4">
          See All
        </Link>
      </div>

      {myBlogs.length === 0 ? (
        <p className="text-gray-500">Haven't written any blogs yet.</p>
      ) : (
        <div className="space-y-6">
          {myBlogs.slice(0, 10).map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PersonalProfile;
