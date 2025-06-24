import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useBlog } from "../../context/BlogContext";
import { Link } from "react-router-dom";
import BlogCard from "./BlogCard";

function MyBlogs() {
  const { islogedin } = useAuth();
  const { myBlogs } = useBlog();

  const [filter, setFilter] = useState("all"); // all | published | draft

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

  const filteredBlogs = myBlogs.filter((blog) => {
    if (filter === "published") return blog.published === true;
    if (filter === "draft") return blog.published === false;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">Your Blogs</h2>
        <div className="space-x-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("published")}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === "published"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setFilter("draft")}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === "draft"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            Draft
          </button>
        </div>
      </div>

      {filteredBlogs.length === 0 ? (
        <p className="text-gray-500">No blogs found for this filter.</p>
      ) : (
        <div className="space-y-6">
          {filteredBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBlogs;
