import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import { api } from "../../services/api";
import { ArrowLeft, Bell, Eye, Trash, UserCog } from "lucide-react";

function Setting() {
  const navigate = useNavigate();
  const { userId, allowedNotification } = useAuth();
  const [sendNotification, setSendNotification] = useState(allowedNotification);
  const [isPublic, setIsPublic] = useState(true);
  const { showSuccess, showError, showConfirm } = useToast();

  const handleToggleNotification = async () => {
    try {
      const res = await api.put(`/user/send-notification-toggle/${userId}`);
      if (res.status === 200) {
        setSendNotification(res.data.status);
      }
    } catch (error) {
      showError("Failed to update notification setting.");
    }
  };

  const handleCheckboxChange = async () => {
    setSendNotification(!sendNotification);
    handleToggleNotification();
  };

  const handleDeleteAccount = async () => {
    showConfirm({
      message: "Do you really want to delete this blog?",
      onOk: async () => {
        try {
          const res = await api.delete(`/user/delete-profile`);
          if (res.status === 200) {
            showSuccess(res?.data?.message || "Deleted successfully");
            navigate("/");
          }
        } catch (error) {
          console.error(error);
          showError(error?.response?.data?.error || "Deletion failed");
        }
      },
      onCancel: () => {
        showError("Cancelled");
      },
    });
    if (confirmed) {
      try {
        await api.delete(`/user/delete/${userId}`);
        navigate("/goodbye");
      } catch (error) {
        showError("Error deleting account.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-lg rounded-xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-blue-600 underline mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>

      {/* Notification Toggle */}
      <div className="flex flex-col gap-1 mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-700">
            <Bell className="w-5 h-5 text-blue-600" />
            <span>Receive Notifications</span>
          </div>
          <label className="inline-flex items-center cursor-pointer relative">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={sendNotification}
              onChange={handleCheckboxChange}
            />
            <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition-all"></div>
            <div className="absolute w-4 h-4 bg-white rounded-full left-1 top-1 transition-transform peer-checked:translate-x-full"></div>
          </label>
        </div>

        <p className="text-sm text-gray-500">
          Notifications are{" "}
          <span className="font-medium">
            {sendNotification ? "Enabled" : "Disabled"}
          </span>
        </p>
      </div>

      {/* Public Profile Toggle */}
      {/* <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-gray-700">
          <Eye className="w-5 h-5 text-green-600" />
          <span>Public Profile</span>
        </div>
        <label className="inline-flex items-center cursor-pointer relative">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isPublic}
            onChange={handlePublicToggle}
          />
          <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-all"></div>
          <div className="absolute w-4 h-4 bg-white rounded-full left-1 top-1 transition-transform peer-checked:translate-x-full"></div>
        </label>
      </div> */}

      {/* Edit Profile */}
      {/* <div className="mb-6 flex items-center gap-2 text-blue-600 hover:underline cursor-pointer">
        <UserCog className="w-5 h-5" />
        <button onClick={() => navigate("/personal-profile/edit")}>
          Edit Profile Information
        </button>
      </div> */}

      {/* Danger Zone */}
      <div className="mt-8 border-t pt-4">
        <button
          onClick={handleDeleteAccount}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          <Trash className="w-4 h-4" />
          Delete Account
        </button>
      </div>
    </div>
  );
}

export default Setting;
