import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300">
      {<Navbar />}
      <main className="pt-4 px-4">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
