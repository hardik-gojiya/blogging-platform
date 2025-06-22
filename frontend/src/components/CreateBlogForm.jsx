import React, { useState } from "react";
import { RichTextEditor } from "@mantine/rte";
import { api } from "../services/api";

function CreateBlogForm() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState(["name", "surname"]);
  const [localTag, setLocalTag] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const handleAddTag = () => {
    if (localTag) {
      tags.push(localTag);
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
        title,
        slug: title.split(" ").join("-"),
        content,
        tags,
        published: isChecked,
      });
      console.log(res);
      if (res.data.status === 201) {
        alert(res.data.message || "blog created sucessfully");
      }
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.error || "something went wrong");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Blog</h1>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <RichTextEditor value={content} onChange={setContent} />
        <p dangerouslySetInnerHTML={{ __html: content }}></p>
        <input
          type="text"
          placeholder="add tag"
          value={localTag}
          onChange={(e) => {
            setLocalTag(e.target.value);
          }}
          className="w-full p-2 border border-gray-300 rounded"
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          add tag
        </button>
        {tags.length === 0 ? (
          <p>Add tags</p>
        ) : (
          <div>
            tags:
            {tags.map((tag, idx) => (
              <div key={idx} className="flex justify-around">
                <li>{tag}</li>
                <button onClick={(e) => handleRemoveTag(e, tag)}>remove</button>
              </div>
            ))}
          </div>
        )}
        {/* Toggle Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-600 transition-all"></div>
          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
            {isChecked ? "Published" : "Draft"}
          </span>
        </label>
        <button
          type="button"
          onClick={() => handleSubmit()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save
        </button>
      </form>
    </div>
  );
}

export default CreateBlogForm;
