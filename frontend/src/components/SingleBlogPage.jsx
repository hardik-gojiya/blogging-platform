import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ThumbsUp, MessageSquare, Pencil, Trash2 } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useBlog } from "../context/BlogContext";
import CommentList from "./Comments/CommentList";
import CommentInput from "./Comments/CommentInput";
import { useToast } from "../hooks/useToast";

function SingleBlogPage() {
  const { showSuccess, showError } = useToast();
  const { id: blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [localComment, setLocalComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [showFullContent, setShowFullContent] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const contentRef = useRef(null);
  const inputRef = useRef(null); 

  const { userId } = useAuth();
  const { handleLike, deleteBlog, handlePublishBlog } = useBlog();

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const res = await api(`/blog/getBlogById/${blogId}`);
      if (res.status === 200) {
        setBlog(res.data.blog);
      }
    } catch (error) {
      console.error(error);
      showError(error?.response?.data?.error || "Failed to load blog");
    }
  };

  useEffect(() => {
    if (contentRef.current && contentRef.current.scrollHeight > 300) {
      setIsOverflowing(true);
    } else {
      setIsOverflowing(false);
    }
  }, [blog?.content]);

  const handleAddComment = async () => {
    if (!localComment.trim()) return;
    try {
      let res;
      if (replyingTo) {
        res = await api.post(`/comment/reply-to-Comment/${replyingTo}`, {
          content: localComment,
        });
      } else {
        res = await api.post(`/comment/create-comment/${blog._id}`, {
          content: localComment,
        });
      }
      if (res.status === 201) {
        await fetchBlog();
        setLocalComment("");
        setReplyingTo(null);
        showSuccess(res.data.message || "Comment added");
      }
    } catch (error) {
      console.error(error);
      showError(error?.response?.data?.error || "Error while commenting");
    }
  };

  const handleReplyClick = (id, name) => {
    setReplyingTo(id);
    setLocalComment(`@${name} `);
    // ✅ Scroll to comment input
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  if (!blog) {
    return <p className="text-center text-gray-500 py-10">Loading blog...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 break-words mb-1">
            {blog.title}
          </h1>
          <p className="text-gray-500 text-sm">
            By <span className="font-medium">{blog.author.name}</span>
          </p>
        </div>

        {userId?.toString() === blog.author._id.toString() && (
          <div className="flex gap-2 mt-2 sm:mt-0 sm:ml-auto">
            {!blog.published && (
              <button
                onClick={() => handlePublishBlog(blog._id)}
                className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
              >
                Publish
              </button>
            )}
            <button className="flex items-center gap-1 text-blue-600 hover:underline text-sm">
              <Pencil className="w-4 h-4" /> Edit
            </button>
            <button
              onClick={() => deleteBlog(blog._id)}
              className="flex items-center gap-1 text-red-500 hover:underline text-sm"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className={`prose max-w-none text-gray-800 mb-4 break-words whitespace-pre-wrap transition-all duration-300 ${
          showFullContent ? "" : "max-h-[300px] overflow-hidden"
        }`}
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />

      {isOverflowing && (
        <button
          onClick={() => setShowFullContent(!showFullContent)}
          className="text-blue-600 text-sm hover:underline mb-4"
        >
          {showFullContent ? "Show less" : "Show more"}
        </button>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {blog.tags.map((tag, idx) => (
          <span
            key={idx}
            className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-sm text-gray-600 mb-8">
        <button
          onClick={() => {
            handleLike(blog._id);
            fetchBlog();
          }}
          className="flex items-center gap-1 hover:text-blue-600 transition cursor-pointer"
        >
          <ThumbsUp
            className={`w-4 h-4 ${
              blog.likes?.includes(userId) ? "fill-blue-600 text-blue-600" : ""
            }`}
          />
          {blog.likesCount}
        </button>
        <div className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" />
          {blog.commentsCount}
        </div>
        <p className="ml-auto text-xs text-gray-400">
          Created: {new Date(blog.createdAt).toLocaleString()}
        </p>
      </div>

      <hr className="mb-6" />

      {/* Comments Section */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Comments</h2>

      {/* Comment Input */}
      <div ref={inputRef}>
        <CommentInput
          value={localComment}
          setValue={setLocalComment}
          replyingTo={replyingTo}
          onSubmit={handleAddComment}
          onCancel={() => {
            setReplyingTo(null);
            setLocalComment("");
          }}
        />
      </div>

      {/* Render Comments */}
      <CommentList
        comments={blog.comments}
        blogAuthorId={blog.author._id}
        onReplyClick={handleReplyClick}
      />
    </div>
  );
}

export default SingleBlogPage;
