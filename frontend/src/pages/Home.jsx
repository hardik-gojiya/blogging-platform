import React from "react";
import { useBlog } from "../context/BlogContext";
import { MessageSquare, ThumbsUp, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { userId } = useAuth();
  const { allBlogs, handleLike, deleteBlog } = useBlog();
  return (
    <div>
      <h1>Home</h1>
      <h2>All Blogs</h2>
      {allBlogs.length === 0 ? (
        <p>No Blogs found</p>
      ) : (
        allBlogs.map((blog) => (
          <div key={blog._id}>
            <p>{blog.title}</p>
            <p>{blog.content}</p>
            {blog.tags.map((tag, idx) => (
              <li key={idx}>#{tag}</li>
            ))}
            <button onClick={() => handleLike(blog._id)}>
              <ThumbsUp />
              {blog.likesCount}
            </button>
            <button>
              <MessageSquare />
              {blog.commentsCount}
            </button>
            {userId.toString() === blog.author._id.toString() ? (
              <button
                onClick={() => {
                  deleteBlog(blog._id);
                }}
              >
                <Trash2 />
              </button>
            ) : (
              ""
            )}
            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
