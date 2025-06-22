import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircleUserRound } from "lucide-react";

function Navbar() {
  const { islogedin, name, email, handleLogOut } = useAuth();
  return (
    <div
      style={{
        position: "sticky",
        top: "0px",
        backgroundColor: "black",
        color: "white",
      }}
    >
      <Link to="/">Home</Link>
      <Link to={"/Create-Blog"}>Create Blog</Link>
      {islogedin ? (
        <div style={{ display: "flex" }}>
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
