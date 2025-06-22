import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api.js";
import { useToast } from "../hooks/useToast.jsx";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const { showSuccess, showError, showConfirm } = useToast();
  const [islogedin, setIslogedin] = useState(false);
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const checkLoggedin = async () => {
    try {
      let res = await api.get("/auth/checkAuth");
      if (res.status === 200) {
        setIslogedin(true);
        setUserId(res.data.userId);
        setEmail(res.data.email);
        setName(res.data.name);
      }
    } catch (error) {
      setIslogedin(false);
      console.log(error);
    }
  };

  const handleLogOut = async () => {
    showConfirm({
      message: "Do you want to Logout?",
      onOk: async () => {
        try {
          let res = await api.post("/auth/logout");
          showSuccess(res?.data?.message || "logout succesfully");
          setIslogedin(false);
          setUserId(null);
          setEmail("");
          setName("");
        } catch (error) {
          showError(error?.response?.data?.error || "error in logout");
        }
      },
      onCancel: () => {},
    });
  };

  useEffect(() => {
    checkLoggedin();
  }, [islogedin]);

  return (
    <AuthContext.Provider
      value={{
        userId,
        checkLoggedin,
        islogedin,
        setIslogedin,
        name,
        email,
        handleLogOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
