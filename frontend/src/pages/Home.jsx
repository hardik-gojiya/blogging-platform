import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useBlog } from "../context/BlogContext";
import BlogCard from "./Blog/BlogCard";
import { Link } from "react-router-dom";

function Home() {
  const { allBlogs } = useBlog();
  const [popularUsers, setPopularUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPopularUsers = async () => {
    try {
      const res = await api.get("/user/popular");
      setPopularUsers(res.data.users);
    } catch (err) {
      console.error("Failed to load popular users", err);
    }
  };

  useEffect(() => {
    fetchPopularUsers();
  }, []);

  const popularBlogs = [...allBlogs]
    .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0))
    .slice(0, 5);

  const filteredBlogs = allBlogs.filter((blog) => {
    const search = searchTerm.toLowerCase();
    return (
      blog.title.toLowerCase().includes(search) ||
      blog.content.toLowerCase().includes(search)
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search blogs..."
          className="w-full sm:w-96 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Blog List */}
        <div className="w-full lg:w-2/3">
          {filteredBlogs.length === 0 ? (
            <p className="text-gray-500">No Blogs found for "{searchTerm}"</p>
          ) : (
            filteredBlogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-1/3 space-y-6">
          {/* Popular Blogs */}
          <div className="p-4 rounded-xl border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Popular Blogs
            </h3>
            {popularBlogs.length === 0 ? (
              <p className="text-gray-500 text-sm">No blogs found</p>
            ) : (
              <ul className="space-y-4">
                {popularBlogs.map((blog) => (
                  <li key={blog._id}>
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="text-sm font-semibold text-blue-600 hover:underline block"
                    >
                      {blog.title}
                    </Link>
                    <p className="text-xs text-gray-500">
                      {blog.likesCount} likes
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Popular Users */}
          <div className="p-4 rounded-xl border shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Popular Users
            </h3>
            {popularUsers.length === 0 ? (
              ""
            ) : (
              <ul className="space-y-4">
                {popularUsers.map((user) => (
                  <li key={user._id} className="flex items-center gap-3">
                    <img
                      src={user.profilePic || "/profilepic.jpeg"}
                      alt={user.username}
                      className="w-10 h-10 rounded-full border object-cover"
                    />
                    <div>
                      <Link
                        to={`/profile/${user.username}`}
                        className="text-sm font-medium text-gray-800 hover:underline"
                      >
                        {user.username}
                      </Link>
                      <p className="text-xs text-gray-500">
                        {user.followers?.length || 0} Followers
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Home;
