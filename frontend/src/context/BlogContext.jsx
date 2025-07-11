import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { api } from "../services/api";
import { useToast } from "../hooks/useToast";

const BlogContext = createContext();

export const useBlog = () => {
  return useContext(BlogContext);
};

export const BlogProvider = ({ children }) => {
  const navigate = useNavigate();
  const { showSuccess, showError, showConfirm } = useToast();
  const { userId, islogedin } = useAuth();
  const [myBlogs, setMyblogs] = useState([]);
  const [allBlogs, setAllblogs] = useState([]);

  const fetchMyBlogs = async () => {
    try {
      let res = await api.get(`/blog/getAllBlogsofOneUser/${userId}`);
      if (res.status === 200) {
        setMyblogs(res.data.blogs);
      }
    } catch (error) {
      console.log(error);
      setMyblogs([]);
      showError("somthing went wrong");
    }
    return allBlogs;
  };

  const fetchAllBlogs = async () => {
    try {
      let res = await api.get(`/blog/getAllBlogs`);
      if (res.status === 200) {
        setAllblogs(res.data.blogs);
      }
    } catch (error) {
      console.log(error);
      setAllblogs([]);
      showError("somthing went wrong");
    }
  };

  useEffect(() => {
    // fetchAllBlogs();
    if (userId) {
      fetchMyBlogs();
    }
  }, [userId]);

  const deleteBlog = async (id) => {
    showConfirm({
      message: "Do you really want to delete this blog?",
      onOk: async () => {
        try {
          const res = await api.delete(`/blog/deleteBlog/${id}`);
          if (res.status === 200) {
            showSuccess(res?.data?.message || "Deleted successfully");
            fetchMyBlogs();
            fetchAllBlogs();
            navigate("/");
          }
        } catch (error) {
          console.error(error);
          showError(error?.response?.data?.error || "Deletion failed");
        }
      },
      onCancel: () => {
        showError("Cancelled");
      },
    });
  };

  const handleLike = async (id) => {
    try {
      if (!islogedin) {
        showError("Login required");
        navigate("/login");
        return null;
      }
      const res = await api.post(`/blog/like-unlikeBlog/${id}`);
      if (res.status === 200) {
        fetchMyBlogs();
        fetchAllBlogs();
        fecthParticularUser();
      }
    } catch (error) {
      console.log(error);
      showError(error?.response?.data?.error);
      return null;
    }
  };

  const handlePublishBlog = async (id) => {
    showConfirm({
      message: "Do you want to publish this blog?",
      onOk: async () => {
        try {
          let res = await api.put(`/blog/publishBlog/${id}`);
          if (res.status === 200) {
            fetchMyBlogs();
            showSuccess(res?.data?.message || "published sucessfully");
          }
        } catch (error) {
          console.log(error);
          showError(error?.response?.data?.error);
        }
      },
      onCancel: () => {},
    });
  };

  const fecthParticularUser = async (profileId) => {
    if (!profileId) {
      return;
    }
    try {
      let res = await api.get(`/blog/getAllPublishBlogsOfOneUser/${profileId}`);
      if (res.status === 200) {
        return res;
      }
    } catch (error) {
      console.log(error);
      showError("somthing went wrong");
    }
  };

  return (
    <BlogContext.Provider
      value={{
        myBlogs,
        handleLike,
        handlePublishBlog,
        fetchAllBlogs,
        fetchMyBlogs,
        setAllblogs,
        allBlogs,
        deleteBlog,
        fecthParticularUser,
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
