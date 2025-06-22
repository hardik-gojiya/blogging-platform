import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircleUserRound } from "lucide-react";

function Navbar() {
  const { islogedin, name, handleLogOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-white text-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Left Links */}
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
        <div className="flex items-center space-x-4">
          {islogedin ? (
            <>
              <p className="hidden sm:block font-medium">{name}</p>
              <Link
                to="/personal-profile"
                className="flex items-center gap-2 hover:text-blue-600 transition"
              >
                <span className="bg-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                  {name?.charAt(0).toUpperCase()}
                </span>
              </Link>
              <button
                onClick={handleLogOut}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-full hover:bg-red-500 transition"
              >
                Logout
              </button>
            </>
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
