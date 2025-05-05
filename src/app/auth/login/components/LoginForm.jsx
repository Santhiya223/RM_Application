"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData);
    } catch (ex) {
      toast.error("Login failed!");
      console.error(ex);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-700 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg space-y-6">
        <div className="flex justify-center">
          <Image
            src="/images/logo1.jpeg"
            alt="Logo"
            width={80}
            height={80}
            className="rounded-md"
          />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800">Login</h1>

        <form className="space-y-4" onSubmit={handleFormSubmit}>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              className="input input-bordered w-full h-10 px-4 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="input input-bordered w-full h-10 px-4 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex items-center gap-2 my-4">
            <div className="flex-grow border-t border-gray-300" />
            <span className="text-gray-400 text-sm">or continue with</span>
            <div className="flex-grow border-t border-gray-300" />
          </div>

          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => signIn("google")}
              className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition"
            >
              <FcGoogle size={24} />
            </button>
            <button
              type="button"
              onClick={() => signIn("facebook")}
              className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition"
            >
              <FaFacebook size={24} className="text-blue-600" />
            </button>
            <button
              type="button"
              onClick={() => signIn("github")}
              className="p-2 bg-gray-100 rounded-md hover:bg-gray-200 transition"
            >
              <FaGithub size={24} className="text-black" />
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account yet?{" "}
            <Link href="/auth/signup" className="text-blue-600 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
