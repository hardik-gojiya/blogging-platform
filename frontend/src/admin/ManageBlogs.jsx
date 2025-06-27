import React from "react";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useToast } from "../hooks/useToast";

function ManageBlogs() {
  const [blogs, setBlogs] = useState([]);
  const { showError, showSuccess } = useToast();

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/blog/getAllBlogs");
      setBlogs(res.data.blogs);
    } catch (err) {
      showError("Error fetching blogs");
    }
  };

  const deleteBlog = async (id) => {
    try {
      await api.delete(`/blog/deleteBlog/${id}`);
      showSuccess("Blog deleted");
      fetchBlogs();
    } catch (err) {
      showError("Delete failed");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Blogs</h2>
      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Title</th>
              <th className="p-2">Author</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id} className="border-t">
                <td className="p-2">{blog.title}</td>
                <td className="p-2">{blog.author?.username}</td>
                <td className="p-2">
                  {blog.published ? "Published" : "Draft"}
                </td>
                <td className="p-2 space-x-2">
                  <button
                    className="text-sm text-red-600"
                    onClick={() => deleteBlog(blog._id)}
                  >
                    Delete
                  </button>
                  {/* Add Publish/Edit later */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageBlogs;
