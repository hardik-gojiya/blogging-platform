import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import { api } from "../../services/api";

function Setting() {
  const navigate = useNavigate();
  const { userId, allowedNotification } = useAuth();
  const [sendNotification, setSendNotification] = useState(allowedNotification);
  const { showSuccess, showError, showConfirm } = useToast();

  const handleToggleNotification = async () => {
    try {
      let res = await api.put(`/user/send-notification-toggle/${userId}`);
      if (res.status === 200) {
        setSendNotification(res.data.status);
      }
    } catch (error) {
      console.log(error);
      showError("Something Went wrong");
    }
  };

  const handleCheckboxChange = async (e) => {
    setSendNotification(e.target.checked);
    handleToggleNotification();
  };

  return (
    <div
    // className=" absolute top-36 left-1/2 -translate-x-1/2 z-40 bg-transparent rounded-xl shadow-lg w-[90vw] sm:w-80 max-h-[70vh] overflow-y-auto p-4 border transition-all duration-200 ease-in-out transform scale-95"
    >
      <button onClick={() => navigate(-1)}>Back</button>
      <h1>Settings</h1>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={sendNotification}
          onChange={handleCheckboxChange}
        />
        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-600 transition-all"></div>
        <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
        <span className="ml-3 text-sm font-medium text-gray-900">
          Notification from following
        </span>
      </label>
    </div>
  );
}

export default Setting;
