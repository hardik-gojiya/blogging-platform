import { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { islogedin, setIslogedin } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let res = await api.post(
        "/auth/login",
        { email, password },
        {
          withCredentials: true,
        }
      );
      if (res.status === 200) {
        alert(res?.data?.message || "Register Successfully");
        setIslogedin(true);
        setEmail("");
        setPassword("");
        navigate("/");
      }
    } catch (error) {
      alert(error?.response?.data?.error || "Error in login");
    }
  };

  return (
    <div>
      <h1>login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
