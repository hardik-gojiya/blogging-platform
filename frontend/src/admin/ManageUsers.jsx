import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useToast } from "../hooks/useToast";
import { Link } from "react-router-dom";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const { showError, showSuccess } = useToast();

  const fetchUsers = async () => {
    try {
      const res = await api.get("/user/all-users");
      setUsers(res.data.users);
    } catch (err) {
      showError("Failed to load users");
    }
  };

  const toggleBlock = async (id, isBlocked) => {
    try {
      await api.put(`/user/block-unblock/${id}`);
      showSuccess(`User ${isBlocked ? "unblocked" : "blocked"}`);
      fetchUsers();
    } catch (err) {
      showError("Action failed");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      {users?.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="w-full border text-left">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Username</th>
              <th className="p-2">Email</th>
              <th className="p-2">Followers</th>
              <th className="p-2">Following</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-2">
                  <Link
                    to={`/profile/${user._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {user.username}
                  </Link>
                </td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.followers?.length || 0}</td>
                <td className="p-2">{user.following?.length || 0}</td>
                <td className="p-2">
                  <button
                    onClick={() => toggleBlock(user._id, user.blocked)}
                    className={`px-3 py-1 text-sm rounded ${
                      user.blocked
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {user.blocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ManageUsers;
