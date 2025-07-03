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
  const [username, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setprofilePic] = useState("");
  const [role, setRole] = useState("");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const checkLoggedin = async () => {
    try {
      let res = await api.get("/auth/checkAuth");
      if (res.status === 200) {
        if (res.data.blocked) {
          showError("Your account is blocked.");
          setIslogedin(false);
          return;
        }

        setIslogedin(true);
        setUserId(res.data.userId);
        setEmail(res.data.email);
        setuserName(res.data.username);
        setprofilePic(res.data.profilePic);
        setRole(res.data.role);
        setFollowers(res.data.followers || []);
        setFollowing(res.data.following || []);
      }
    } catch (error) {
      setIslogedin(false);
      setUserId("");
      setEmail("");
      setuserName("");
      setRole("");
      setFollowers([]);
      setFollowing([]);
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
          setuserName("");
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
        username,
        email,
        handleLogOut,
        profilePic,
        role,
        followers,
        following,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
