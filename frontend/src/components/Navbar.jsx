import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { islogedin, name, email, handleLogOut } = useAuth();
  return (
    <div>
      <Link to="/">Home</Link>
      {islogedin ? (
        <div>
          {" "}
          <p>{name}</p>
          <button onClick={handleLogOut}>logout</button>
        </div>
      ) : (
        <>
          <Link to="/register">register</Link>
          <Link to="/login">login</Link>
        </>
      )}
    </div>
  );
}

export default Navbar;
