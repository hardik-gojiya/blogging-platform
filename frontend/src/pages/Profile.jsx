import React from "react";
import { useAuth } from "../context/AuthContext";
import { useBlog } from "../context/BlogContext";
import { MessageSquare, ThumbsUp, Trash2 } from "lucide-react";

function Profile() {
  const { islogedin, name, email, handleLogOut } = useAuth();
  const { myBlogs, handleLike, handlePublishBlog } = useBlog();

  if (!islogedin) {
    return <p>unAuthorized</p>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Name: {name}</p>
      <p>Email: {email}</p>
      <hr />
      <h2>Your blogs:</h2>
      <div>
        {myBlogs.length === 0 ? (
          <p>You havn't any blog </p>
        ) : (
          <div>
            {myBlogs.map((blog) => (
              <div key={blog._id}>
                <p>{blog.title}</p>
                <p>{blog.content}</p>
                {blog.tags.map((tag, idx) => (
                  <li key={idx}>#{tag}</li>
                ))}
                <button
                  disabled={blog.published}
                  onClick={() => handlePublishBlog(blog._id)}
                >
                  {blog.published ? "published" : "publish"}
                </button>
                <button onClick={() => handleLike(blog._id)}>
                  <ThumbsUp />
                  {blog.likesCount}
                </button>
                <button>
                  <MessageSquare />
                  {blog.commentsCount}
                </button>
                <button>
                  <Trash2 />
                </button>
                <hr />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
