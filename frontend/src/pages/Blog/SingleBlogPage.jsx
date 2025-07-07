import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ThumbsUp,
  MessageSquare,
  Pencil,
  Trash2,
  Bookmark,
} from "lucide-react";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useBlog } from "../../context/BlogContext";
import CommentList from "../../components/Comments/CommentList";
import CommentInput from "../../components/Comments/CommentInput";
import { useToast } from "../../hooks/useToast";
import ScrollToTop from "react-scroll-to-top";

function SingleBlogPage() {
  const navigate = useNavigate();
  const { showSuccess, showError, showConfirm } = useToast();
  const { islogedin, userId, user } = useAuth();
  const { identifier } = useParams();
  const [blog, setBlog] = useState(null);
  const [localComment, setLocalComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [showFullContent, setShowFullContent] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const contentRef = useRef(null);
  const inputRef = useRef(null);

  const { handleLike, deleteBlog, handlePublishBlog } = useBlog();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    let res;
    try {
      if (!identifier) return;

      if (/^[0-9a-fA-F]{24}$/.test(identifier)) {
        // MongoDB ObjectId format — fetch by ID
        res = await api.get(`/blog/getBlogById/${identifier}`);
      } else {
        // Otherwise, treat as slug
        res = await api.get(`/blog/getBlogBySlug/${identifier}`);
      }
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
    if (!islogedin) {
      navigate("/login");
      return;
    }
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
    inputRef.current?.focus();
    setTimeout(() => {
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const deleteComment = async (id) => {
    showConfirm({
      message: "Do you really want to delete this comment?",
      onOk: async () => {
        try {
          let res = await api.delete(`/comment/delete-Comment/${id}`);
          if (res.status === 200) {
            showSuccess(res?.data?.message);
            fetchBlog();
          }
        } catch (error) {
          console.error(error);
          showError(error?.response?.data?.error || "Something went wrong");
        }
      },
      onCancel: () => {
        showError("Cancelled");
      },
    });
  };

  useEffect(() => {
    if (userId && blog) {
      setIsSaved(blog._id && user?.savedBlogs?.includes(blog._id));
    }
  }, [userId, blog, user]);

  const handleToggleSave = async () => {
    if (!islogedin) return navigate("/login");

    try {
      if (isSaved) {
        await api.delete(`/blog/remove-saved-blog/${blog._id}`);
      } else {
        await api.put(`/blog/save-blog/${blog._id}`);
      }
      setIsSaved(!isSaved);
    } catch (err) {
      console.log(err);
      showError("Action failed");
    }
  };

  if (!blog) {
    return <p className="text-center text-gray-500 py-10">Blog not found</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center mb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 break-words">
            {blog.title}
          </h1>{" "}
          By{" "}
          <Link
            to={
              userId === blog.author._id
                ? "/personal-profile"
                : `/profile/${blog.author._id}`
            }
            className="text-gray-500 text-sm hover:underline"
          >
            <span className="font-medium">{blog.author.username}</span>
          </Link>
        </div>

        {userId?.toString() === blog.author._id.toString() && (
          <div className="flex flex-wrap gap-2">
            {!blog.published && (
              <button
                onClick={() => handlePublishBlog(blog._id)}
                className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded"
              >
                Publish
              </button>
            )}
            <Link
              to={`/edit-Blog/${blog._id}`}
              className="flex items-center gap-1 text-blue-600 hover:underline text-sm"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </Link>
            <button
              onClick={() => deleteBlog(blog._id)}
              className="flex items-center gap-1 text-red-500 hover:underline text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className={`mb-4 transition-all duration-300 ${
          showFullContent ? "" : "max-h-[300px] overflow-hidden"
        }`}
      >
        <div className="prose max-w-none text-gray-800 break-words whitespace-pre-wrap overflow-x-auto p-2 bg-white rounded-md">
          <div dangerouslySetInnerHTML={{ __html: blog.content }} />
        </div>
      </div>

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
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-8">
        <button
          onClick={async () => {
            await handleLike(blog._id);
            fetchBlog();
          }}
          className="flex items-center gap-1 hover:text-blue-600 transition cursor-pointer"
        >
          <ThumbsUp
            className={`w-4 h-4 ${
              blog.likes?.includes(userId) ? "fill-gray-600 text-gray-600" : ""
            }`}
          />
          {blog.likesCount}
        </button>
        <div className="flex items-center gap-1">
          <MessageSquare className="w-4 h-4" />
          {blog.commentsCount}
        </div>
        <button
          onClick={handleToggleSave}
          className="flex items-center gap-1 hover:text-blue-600 transition cursor-pointer"
        >
          <Bookmark
            className={`w-4 h-4 ${
              isSaved ? "fill-gray-600 text-gray-600" : "text-gray-500"
            }`}
          />
          <span className="text-sm">{isSaved ? "Saved" : "Save"}</span>
        </button>

        <p className="text-xs text-gray-400 ml-auto">
          Created: {new Date(blog.createdAt).toLocaleString()}
        </p>
      </div>

      <hr className="mb-6" />

      {/* Comments */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Comments</h2>

      {/* Comment Input */}
      <div id="comments" ref={inputRef}>
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

      {/* Comment List */}
      <CommentList
        comments={blog.comments}
        blogAuthorId={blog.author._id}
        onReplyClick={handleReplyClick}
        deleteComment={deleteComment}
      />
      {/* Author Info */}
      <div className="mt-12 border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Author</h3>
        <div className="flex items-center gap-4">
          <img
            src={blog.author.profilePic || "/profilepic.jpeg"}
            alt={blog.author.username}
            className="w-14 h-14 rounded-full object-cover border"
          />
          <div>
            <Link
              to={
                userId === blog.author._id
                  ? "/personal-profile"
                  : `/profile/${blog.author.username}`
              }
              className="text-md font-semibold text-gray-900 hover:underline"
            >
              {blog.author.username}
            </Link>
            {blog.author.bio && (
              <p className="text-sm text-gray-600 mt-1 max-w-md">
                {blog.author.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <ScrollToTop
        smooth
        color="#2563eb"
        style={{
          backgroundColor: "white",
          boxShadow: "0 0 10px rgba(0,0,0,0.1)",
        }}
        top={300}
        className="flex justify-center align-bottom"
      />
    </div>
  );
}

export default SingleBlogPage;
