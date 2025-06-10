import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div>
      <Link to="/register">register</Link>
      <Link to="/login">login</Link>
    </div>
  );
}

export default Navbar;
