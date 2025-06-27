import { api } from "../services/api";
import { useState } from "react";
import { useEffect } from "react";

function Dashboard() {
  const [totalusers, setTotalUsers] = useState(null);
  const [totalblogs, setTotalBlogs] = useState(null);
  const [totalcomments, setTotalComments] = useState(null);
  const fetchTotalUsers = async () => {
    let res = await api.get(`/user/total-users`);
    setTotalUsers(res.data.totalUsers);
  };
  const fetchTotalBlogs = async () => {
    let res = await api.get(`/blog/get-total-blogs`);
    setTotalBlogs(res.data.totalBlogs);
  };
  const fetchTotalComments = async () => {
    let res = await api.get(`/comment/get-total-comments`);
    setTotalComments(res.data.totalComments);
  };
  useEffect(() => {
    fetchTotalBlogs();
    fetchTotalUsers();
    fetchTotalComments();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          Total Blogs: {totalblogs}
        </div>
        <div className="bg-white p-4 rounded shadow">
          Total Users: {totalusers}
        </div>
        <div className="bg-white p-4 rounded shadow">
          Comments: {totalcomments}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
