import React, { use, useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      let res = await api.post(
        "/auth/register",
        { name, email, password },
        {
          withCredentials: true,
        }
      );
      if (res.status === 201) {
        alert(res.data.message || "Register Successfully");
        setEmail("");
        setName("");
        setPassword("");
        navigate("/");
      }
    } catch (error) {
      alert(error?.response?.data?.error || "Error in register");
    }
  };

  return (
    <div>
      <h1>register</h1>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          required
        />
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
