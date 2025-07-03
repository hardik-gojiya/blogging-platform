import React from "react";
import { useNavigate } from "react-router-dom";

function Setting() {
  const navigate = useNavigate();
  return (
    <div>
      <button onClick={() => navigate(-1)}>Back</button>
      <h1>Settings</h1>
    </div>
  );
}

export default Setting;
