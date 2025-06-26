import { useBlog } from "../context/BlogContext";
import BlogCard from "./Blog/BlogCard";

function Home() {
  const { allBlogs } = useBlog();

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-wrap">
      <h2 className="text-xl font-semibold text-gray-600 mb-6">All Blogs</h2>

      {allBlogs.length === 0 ? (
        <p className="text-gray-500">No Blogs found</p>
      ) : (
        allBlogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)
      )}
    </div>
  );
}

export default Home;
