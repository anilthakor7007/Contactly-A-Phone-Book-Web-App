import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoginForm from "../Components/Contact List/LoginForm";
import { loginUser } from "../Auth/authAPI";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);
  const token = useSelector((state) => state.auth?.token);
  const user = useSelector((state) => state.auth?.user);
  const loading = useSelector((state) => state.auth?.loading);
  const error = useSelector((state) => state.auth?.error);

  console.log("user:", user);
  console.log("loading status:", loading);
  console.log("error arahi hai:", error);
  console.log("token while login:", localStorage.getItem("token"));

  const handleLogin = async (formData) => {
    try {
      // Dispatch loginUser action with formData
      console.log(formData);
      const result = await dispatch(loginUser(formData)).unwrap();
      console.log(result.token);
      console.log(result.user.email);

      // Store token in local storage
      localStorage.setItem("token", result.token);

      if (result.token) {
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate("/UserData"); // Navigate to UserData page upon successful login
      }
    } catch (err) {
      // Handle login errors here
      toast.error("Login failed. Please try again.", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error("Login failed:", err);
      setLoginError(error.message); 
    }
  };

  return (
    <div>
      <LoginForm onLogin={handleLogin} err={loginError} />
    </div>
  );
};

export default Login;
