import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./components/NotFound";
import Profile from "./pages/Profile";
import ProtectedRoute from "./hooks/ProtectedRoute";
import CreateBlogForm from "./components/CreateBlogForm";
import SingleBlogPage from "./components/SingleBlogPage";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/personal-profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Create-Blog"
          element={
            <ProtectedRoute>
              <CreateBlogForm />
            </ProtectedRoute>
          }
        />
        <Route path={`/blog/:id`} element={<SingleBlogPage />} />
        <Route path={`/blog/:slug`} element={<SingleBlogPage />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
