import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import RichTextEditor from "@mantine/rte";
import { useToast } from "../../hooks/useToast";

const EditBlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]);
  const [localTag, setLocalTag] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blog/getBlogById/${id}`);
        const blog = res.data.blog;
        setTitle(blog.title);
        setContent(blog.content);
        setTags(blog.tags || []);
        setIsChecked(blog.published);
      } catch (error) {
        showError("Failed to load blog");
      }
    };

    fetchBlog();
  }, [id]);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      showError("Title and content are required");
      return;
    }

    try {
      setLoading(true);
      const res = await api.put(`/blog/editBlog/${id}`, {
        title,
        content,
        tags,
        published: isChecked,
      });

      if (res.status === 200) {
        showSuccess("Blog updated successfully");
        navigate(`/blog/${id}`);
      }
    } catch (err) {
      showError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = localTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags((prev) => [...prev, trimmedTag]);
      setLocalTag("");
    }
  };

  const handleRemoveTag = (e, tag) => {
    e.preventDefault();
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg mt-8">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Edit Blog</h1>
        <button
          onClick={() => navigate(-1)}
          className="mb-2 text-gray-600 hover:underline flex items-center gap-1"
        >
          Cancle
        </button>
      </div>
      <form className="space-y-6">
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <RichTextEditor value={content} onChange={setContent} />

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add tag"
            value={localTag}
            onChange={(e) => setLocalTag(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Tag
          </button>
        </div>

        {tags.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, idx) => (
                <div
                  key={idx}
                  className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                >
                  #{tag}
                  <button
                    onClick={(e) => handleRemoveTag(e, tag)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-600 transition-all"></div>
          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
          <span className="ml-3 text-sm font-medium text-gray-900">
            {isChecked ? "Publish" : "Draft"}
          </span>
        </label>

        <button
          type="button"
          onClick={handleUpdate}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
};

export default EditBlogForm;
