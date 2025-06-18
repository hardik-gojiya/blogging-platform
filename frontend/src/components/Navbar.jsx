import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircleUserRound } from "lucide-react";

function Navbar() {
  const { islogedin, name, email, handleLogOut } = useAuth();
  return (
    <div>
      <Link to="/">Home</Link>
      {islogedin ? (
        <div>
          {" "}
          <p>{name}</p>
          <Link to="/personal-profile">
            <CircleUserRound />
            {name.split("")[0].toUpperCase()}
          </Link>
          <button onClick={handleLogOut}>logout</button>
        </div>
      ) : (
        <>
          <Link to="/register">register</Link>
          <Link to="/login">login</Link>
        </>
      )}
      <hr />
      <hr />
    </div>
  );
}

export default Navbar;
