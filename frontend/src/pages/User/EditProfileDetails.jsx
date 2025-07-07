import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";

function EditProfileDetails() {
  const { user, checkLoggedin } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/user/edit-profile", formData);
      showSuccess(res.data.message || "Profile updated!");
      await checkLoggedin();
      navigate("/personal-profile");
    } catch (err) {
      showError(err?.response?.data?.error || "Update failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 px-4 py-6 bg-white shadow rounded-lg border">
      <h2 className="text-lg font-semibold text-gray-700 text-center mb-4">
        Edit Profile
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Username</label>
          <input
            type="text"
            name="username"
            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Bio</label>
          <textarea
            name="bio"
            rows={3}
            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Write a short bio..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProfileDetails;
