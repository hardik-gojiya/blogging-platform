import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import NotFound from "./components/NotFound";
import ProtectedRoute from "./hooks/ProtectedRoute";
import SingleBlogPage from "./pages/Blog/SingleBlogPage";
import { Toaster } from "react-hot-toast";
import EditBlogForm from "./pages/Blog/EditBlogForm";
import CreateBlogForm from "./pages/Blog/CreateBlogForm";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import PersonalProfile from "./pages/User/PersonalProfile";
import MyBlogs from "./pages/Blog/MyBlogs";
import Profile from "./pages/User/Profile";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import ManageBlogs from "./admin/ManageBlogs";
import ManageUsers from "./admin/ManageUsers";

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
              <PersonalProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-blogs"
          element={
            <ProtectedRoute>
              <MyBlogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
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

        <Route
          path="/edit-Blog/:id"
          element={
            <ProtectedRoute>
              <EditBlogForm />
            </ProtectedRoute>
          }
        />
        <Route path="/blog/:identifier" element={<SingleBlogPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="blogs" element={<ManageBlogs />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
