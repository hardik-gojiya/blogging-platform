import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div>
      <p>Page not found</p>
      <Link to="/">Home</Link>
    </div>
  );
}

export default NotFound;
