import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../services/api";

const BlogContext = createContext();

export const useBlog = () => {
  return useContext(BlogContext);
};

export const BlogProvider = ({ children }) => {
  const { userId } = useAuth();
  const [myBlogs, setMyblogs] = useState([]);

  const fetchMyBlogs = async () => {
    try {
      let res = await api.get(`/blog/getAllBlogsofOneUser/${userId}`);
      if (res.status === 200) {
        setMyblogs(res.data.blogs);
      }
    } catch (error) {
      console.log(error);
      setMyblogs([]);
      alert("somthing went wrong");
    }
  };
  useEffect(() => {
    if (userId) {
      fetchMyBlogs();
    }
  }, [userId]);

  const handleLike = async (id) => {
    try {
      let res = await api.post(`/blog/like-unlikeBlog/${id}`);
      if (res.status === 200) {
        fetchMyBlogs();
      }
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.error);
    }
  };

  const handlePublishBlog = async (id) => {
    try {
      let res = await api.put(`/blog/publishBlog/${id}`);
      if (res.status === 200) {
        fetchMyBlogs();
      }
    } catch (error) {
      console.log(error);
      alert(error?.response?.data?.error);
    }
  };
  return (
    <BlogContext.Provider value={{ myBlogs, handleLike, handlePublishBlog }}>
      {children}
    </BlogContext.Provider>
  );
};
