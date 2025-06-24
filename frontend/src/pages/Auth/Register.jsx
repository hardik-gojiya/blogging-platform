import React, { useState } from "react";
import { api } from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "../../hooks/useToast";

function Register() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isUserNameValid, setIsUserNameValid] = useState(false);

  const checkUsernameValid = async () => {
    try {
      let res = await api.post(`/auth/check-user-name`, { name });
      if (res.status === 200) {
        setIsUserNameValid(true);
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        setIsUserNameValid(false);
      } else {
        showError("Something went wrong");
      }
    }
  };
  useEffect(() => {
    if (name) {
      checkUsernameValid();
    }
  }, [name]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isUserNameValid) {
      showError("Enter valid username");
      return;
    }
    try {
      const res = await api.post(
        "/auth/register",
        { name, email, password },
        { withCredentials: true }
      );
      if (res.status === 201) {
        showSuccess(res.data.message || "Registered Successfully");
        setName("");
        setEmail("");
        setPassword("");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      showError(error?.response?.data?.error || "Error in registration");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-white px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Create Account
        </h1>
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              username
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="@username"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
            {name && (
              <p
                className={`text-sm mt-1 ${
                  isUserNameValid ? "text-green-600" : "text-red-600"
                }`}
              >
                {isUserNameValid
                  ? "Username is available"
                  : "Username is not available"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
