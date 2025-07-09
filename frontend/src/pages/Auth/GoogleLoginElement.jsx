import { signInWithPopup } from "firebase/auth";
import React from "react";
import { auth, googleProvider } from "../../hooks/firebase";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../hooks/useToast";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

function GoogleLoginElement() {
  const navigate = useNavigate();
  const { checkLoggedin } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      let res = await api.post("/auth/google", { token });
      checkLoggedin();
      navigate(-1 || "/");
      showSuccess(res.data.message || "Google Sign-in sucessfull");
    } catch (error) {
      console.error("Google Sign-in Error:", error);
      showError("Google Sign-in Error");
    }
  };

  return (
    <div>
      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-2 text-gray-500 text-sm">OR</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <button
        onClick={handleGoogleLogin}
        className="flex mt-2 items-center cursor-pointer justify-center w-full py-2 border rounded-md mb-4 hover:bg-gray-100 transition"
      >
        <span className="mr-2">
          <img
            width="28"
            height="28"
            src="https://img.icons8.com/color/48/google-logo.png"
            alt="google-logo"
          />
        </span>{" "}
        Continue with Google
      </button>
    </div>
  );
}

export default GoogleLoginElement;
