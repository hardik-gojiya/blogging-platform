import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import BlogCard from "../Blog/BlogCard";
import Loader from "../../components/Loader";
import { useToast } from "../../hooks/useToast";
import { Link } from "react-router-dom";

function SavedBlogs() {
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showError } = useToast();

  const fetchSavedBlogs = async () => {
    try {
      const res = await api.get("/user/get-saved-blogs");
      if (res.status === 200) {
        setSavedBlogs(res.data.savedBlogs);
      }
    } catch (error) {
      console.error(error);
      showError("Failed to fetch saved blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedBlogs();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 min-h-screen">
      <Loader loading={loading} />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Saved Blogs</h1>

      {savedBlogs.length === 0 ? (
        <p className="text-gray-500 text-center">
          You haven’t saved any blogs yet.{" "}
          <Link to="/" className="text-blue-500 underline">
            Explore Blogs
          </Link>
        </p>
      ) : (
        <div className="space-y-6">
          {savedBlogs.map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedBlogs;
