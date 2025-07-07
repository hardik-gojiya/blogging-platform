import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useBlog } from "../../context/BlogContext";
import { Link } from "react-router-dom";
import BlogCard from "./BlogCard";
import { BookmarkCheck } from "lucide-react";

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">Your Blogs</h2>

        <div className="flex flex-wrap gap-2">
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
            title="Draft"
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

        <Link
          to="/saved-blogs"
          className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm transition text-sm w-fit"
          title="Saved Blogs"
        >
          <BookmarkCheck className="w-5 h-5" />
        </Link>
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
