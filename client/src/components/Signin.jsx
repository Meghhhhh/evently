import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";

const Signin = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/users/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      const { accessToken, refreshToken } = response.data.data;

      Cookies.set("accessToken", accessToken, {
        expires: 1,
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("refreshToken", refreshToken, {
        expires: 10,
        secure: true,
        sameSite: "Strict",
      });

      toast.success("User logged in successfully!", {
        autoClose: 1500,
        closeButton: false,
      });
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "An error occurred");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen"
      onKeyDown={handleKeyDown}
    >
      <div className="w-full max-w-md p-8 shadow-lg rounded-lg">
        <fieldset className="border-2 border-gray-300 p-4 rounded-lg">
          <legend className="text-lg font-semibold px-1">Sign In</legend>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 w-full border rounded-md outline-none bg-transparent"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="mt-1 p-2 w-full border rounded-md outline-none bg-transparent"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-end mb-4 px-2 text-sm">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
            />
            <label htmlFor="showPassword" className="ml-2">
              Show Password
            </label>
          </div>
          <Link
            to="/auth/reset-password"
            className="w-full flex justify-center items-center text-sm text-[#FF5364] hover:underline"
          >
            Forgot Password?
          </Link>

          <button
            type="submit"
            className="w-full text-white p-2 rounded-md mt-4 bg-[#FF5364] hover:bg-[#FF5364]/80"
            onClick={handleSubmit}
          >
            Sign In
          </button>

          <p className="mt-4 text-center text-sm">
            Don't have an account?
            <Link
              to="/auth/signup"
              className="text-[#FF5364] hover:underline px-1"
            >
              Sign Up
            </Link>
          </p>
        </fieldset>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signin;