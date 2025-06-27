import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-md p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="space-y-2">
        <NavLink
          to="/admin"
          end
          className="block text-gray-700 hover:underline"
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/blogs"
          className="block text-gray-700 hover:underline"
        >
          Manage Blogs
        </NavLink>
        <NavLink
          to="/admin/users"
          className="block text-gray-700 hover:underline"
        >
          Manage Users
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
