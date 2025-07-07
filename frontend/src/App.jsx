// App.jsx
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import ProtectedRoute from "./hooks/ProtectedRoute";

import Home from "./pages/Home";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import NotFound from "./components/NotFound";
import SingleBlogPage from "./pages/Blog/SingleBlogPage";
import EditBlogForm from "./pages/Blog/EditBlogForm";
import CreateBlogForm from "./pages/Blog/CreateBlogForm";
import PersonalProfile from "./pages/User/PersonalProfile";
import EditProfileDetails from "./pages/User/EditProfileDetails";
import MyBlogs from "./pages/Blog/MyBlogs";
import Profile from "./pages/User/Profile";
import Setting from "./pages/User/Setting";

import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import ManageBlogs from "./admin/ManageBlogs";
import ManageUsers from "./admin/ManageUsers";
import SavedBlogs from "./pages/Blog/SavedBlogs";

function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* Routes with Navbar via Layout */}
        <Route element={<Layout />}>
          {/* Public routes without Navbar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Home />} />
          <Route path="/blog/:identifier" element={<SingleBlogPage />} />

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

          <Route
            path="/personal-profile"
            element={
              <ProtectedRoute>
                <PersonalProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/personal-profile/edit"
            element={
              <ProtectedRoute>
                <EditProfileDetails />
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
            path="/saved-blogs"
            element={
              <ProtectedRoute>
                <SavedBlogs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/:username"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile/settings"
            element={
              <ProtectedRoute>
                <Setting />
              </ProtectedRoute>
            }
          />

          {/* Admin Nested Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="blogs" element={<ManageBlogs />} />
            <Route path="users" element={<ManageUsers />} />
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
