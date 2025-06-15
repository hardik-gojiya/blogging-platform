import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api.js";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [islogedin, setIslogedin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const checkLoggedin = async () => {
    try {
      let res = await api.get("/auth/checkAuth");

      if (res.status === 200) {
        setIslogedin(true);
        setEmail(res.data.email);
        setName(res.data.name);
      }
    } catch (error) {
      setIslogedin(false);
      console.log(error);
    }
  };

  const handleLogOut = async () => {
    try {
      if (window.confirm("are you sure you want to logout")) {
        let res = await api.post("/auth/logout");
        alert(res?.data?.message || "logout succesfully");
        setIslogedin(false);
        setEmail("");
        setName("");
      }
    } catch (error) {
      alert(error?.response?.data?.error || "error in logout");
    }
  };

  useEffect(() => {
    checkLoggedin();
  }, [islogedin]);

  return (
    <AuthContext.Provider
      value={{
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
