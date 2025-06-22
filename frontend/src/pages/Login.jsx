import { useState } from "react";
import { api } from "../services/api";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks/useToast";

function Login() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { checkLoggedin, islogedin, setIslogedin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let res = await api.post(
        "/auth/login",
        { email, password },
        { withCredentials: true }
      );
      if (res.status === 200) {
        showSuccess(res?.data?.message || "Logged in successfully");
        setIslogedin(true);
        setEmail("");
        setPassword("");
        navigate("/");
        await checkLoggedin();
      }
    } catch (error) {
      showError(error?.response?.data?.error || "Error in login");
    }
  };

  if (islogedin) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
