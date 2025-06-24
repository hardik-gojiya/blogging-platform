import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ChevronDown, LogOut, User, FileText } from "lucide-react";

function Navbar() {
  const { islogedin, username, handleLogOut, userId } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white text-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-base font-semibold hover:text-blue-600 transition"
          >
            Home
          </Link>
          <Link
            to="/Create-Blog"
            className="text-base font-semibold hover:text-blue-600 transition"
          >
            Create Blog
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4 " ref={dropdownRef}>
          {islogedin ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 transition"
              >
                <span className="text-sm font-medium">{username}</span>
                <div className="bg-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {username?.charAt(0).toUpperCase()}
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg z-50 overflow-hidden">
                  <Link
                    to={`/personal-profile`}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    to="/my-blogs"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <FileText className="w-4 h-4" />
                    My Blogs
                  </Link>
                  <button
                    onClick={() => {
                      handleLogOut();
                      setDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/register"
                className="text-sm font-semibold hover:text-blue-600 transition"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold bg-gray-900 text-white rounded-full hover:opacity-90 transition"
              >
                SIGN IN
              </Link>
            </>
          )}
        </div>
      </div>
      <hr className="border-gray-200" />
    </nav>
  );
}

export default Navbar;
