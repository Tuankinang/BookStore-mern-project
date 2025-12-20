import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaEnvelope, FaLock } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import getBaseUrl from "../utils/baseUrl";

const Login = () => {
  const [message, setMessage] = useState("");
  const { login, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${getBaseUrl()}/api/auth/login`, {
        username: data.email,
        password: data.password,
      });

      const { token, user } = response.data;

      login(token, user);

      alert("Đăng nhập thành công!");
      if (user.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      setMessage("Email hoặc mật khẩu không chính xác. Vui lòng thử lại!");
      console.error(error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      alert("Đăng nhập thành công bằng Google!");
      navigate("/");
    } catch (error) {
      alert("Đăng nhập thất bại!");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 font-sans">
      <div className="max-w-7xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 hidden md:block relative">
          <img
            src="https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=1498&q=80"
            alt="Book Store Login"
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-indigo-900 bg-opacity-40 flex flex-col justify-center items-center text-white p-8 text-center">
            <h2 className="text-4xl font-bold mb-4">Book Store</h2>
            <p className="text-lg opacity-90">
              "Không có người bạn nào trung thành như một cuốn sách."
            </p>
            <p className="mt-2 text-sm opacity-75">- Ernest Hemingway</p>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Chào mừng trở lại!
            </h2>
            <p className="text-gray-500 mt-2">Vui lòng đăng nhập để tiếp tục</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaEnvelope />
                </div>
                <input
                  {...register("email", { required: true })}
                  type="email"
                  name="email"
                  id="email"
                  placeholder="name@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
              </div>
            </div>
            <div>
              <label
                className="block text-gray-700 text-sm font-semibold mb-2"
                htmlFor="password"
              >
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaLock />
                </div>
                <input
                  {...register("password", { required: true })}
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
              </div>
            </div>

            {message && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded text-sm">
                {message}
              </div>
            )}

            <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition hover:-translate-y-0.5 duration-200">
              Đăng nhập
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <span className="border-b w-1/5 lg:w-1/4"></span>
            <span className="text-xs text-center text-gray-500 uppercase">
              Hoặc đăng nhập với
            </span>
            <span className="border-b w-1/5 lg:w-1/4"></span>
          </div>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors shadow-sm"
            >
              <FaGoogle className="text-red-500" />
              <span>Google</span>
            </button>
          </div>

          <p className="mt-8 text-center text-gray-600 text-sm">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
