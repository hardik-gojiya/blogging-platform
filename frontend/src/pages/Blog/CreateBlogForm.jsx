import React, { useState } from "react";
import { RichTextEditor } from "@mantine/rte";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useBlog } from "../../context/BlogContext";
import { useToast } from "../../hooks/useToast";

function CreateBlogForm() {
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState(["Blog"]);
  const [localTag, setLocalTag] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const { fetchAllBlogs, fetchMyBlogs } = useBlog();

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const handleAddTag = () => {
    if (localTag) {
      tags.push(localTag.trim().toLowerCase().replace(/\s+/g, ""));
      setLocalTag("");
    }
  };
  const handleRemoveTag = (e, tag) => {
    e.preventDefault();
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    try {
      let res = await api.post(`/blog/createBlog`, {
        title: title.trim(),
        slug: title.trim().toLowerCase().replace(/\s+/g, "-"),
        content,
        tags: Array.isArray(tags)
          ? tags
          : tags.split(",").map((tag) => tag.trim()),
        published: isChecked,
      });
      if (res.status === 201) {
        showSuccess(res.data.message || "blog created sucessfully");
        setTitle("");
        setContent("");
        setTags("");
        setLocalTag("");
        fetchAllBlogs();
        fetchMyBlogs();
        navigate("/personal-profile");
      }
    } catch (error) {
      console.log(error);
      showError(error?.response?.data?.error || "something went wrong");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg mt-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create Blog</h1>
      <form className="space-y-6">
        {/* Title */}
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {/* Rich Text Editor */}
        <RichTextEditor
          value={content}
          onChange={setContent}
          className="h-64 overflow-y-auto"
        />

        {/* Tag Input + Add Button */}
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

        {/* Tag List */}
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

        {/* Publish Toggle */}
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

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Save Blog
        </button>
      </form>
    </div>
  );
}

export default CreateBlogForm;
