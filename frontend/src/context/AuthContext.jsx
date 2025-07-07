import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api.js";
import { useToast } from "../hooks/useToast.jsx";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const { showSuccess, showError, showConfirm } = useToast();
  const [user, setUser] = useState(null);
  const [islogedin, setIslogedin] = useState(false);
  const [userId, setUserId] = useState("");
  const [username, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setprofilePic] = useState("");
  const [role, setRole] = useState("");
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [allowedNotification, setAllowedNotification] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

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
        setUser(res.data);
        setUserId(res.data.userId);
        setEmail(res.data.email);
        setuserName(res.data.username);
        setprofilePic(res.data.profilePic);
        setRole(res.data.role);
        setFollowers(res.data.followers || []);
        setFollowing(res.data.following || []);
        setAllowedNotification(res.data.allowNotification);
      }
    } catch (error) {
      setIslogedin(false);
      setUserId("");
      setEmail("");
      setuserName("");
      setRole("");
      setFollowers([]);
      setFollowing([]);
    } finally {
      setAuthLoading(false);
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
          checkLoggedin();
          navigate("/");
        } catch (error) {
          showError(error?.response?.data?.error || "error in logout");
        }
      },
      onCancel: () => {},
    });
  };

  useEffect(() => {
    checkLoggedin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
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
        allowedNotification,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
