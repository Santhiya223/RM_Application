"use client"

import { useState } from "react";
import { Eye, EyeOff } from 'lucide-react';
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaGithub } from "react-icons/fa6";
import Image from 'next/image';
import { signIn, signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {useAuth} from '@/context/AuthContext'

export default function Login () {
    const {login} = useAuth();
    const { data: session, status } = useSession();
    console.log(status)
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    const isPending = false;
    const isError = false;

    const handleInputChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleFormSubmit = async (e) => {
       e.preventDefault();
       setLoading(true);
       try {
        await login(formData);
        toast.success("Login successful!");
       } catch(ex) {
        toast.error("Login failed!");
        console.error(ex);
       } finally {
        setLoading(false);
      }
    }

    if (session) {
        // User is authenticated
        return (
          <div>
            <h1>Welcome, {session.user.name}!</h1>
            <p>Email: {session.user.email}</p>
            <img src={session.user.image} alt="User Avatar" width={100} height={100} />
            <button onClick={() => signOut()}>Sign Out</button>
          </div>
        );
      }

    return (
       <div className="h-screen flex items-center justify-center ">
            <div className="w-full max-w-sm p-6 bg-opacity-30 backdrop-blur-lg border rounded-xl shadow-lg bg-radial from-[#0085FF] via-[hsl(209,48%,46%)] to-[#003465]">
                <div className="flex items-center justify-center pb-4">
                    <Image src='/images/logo1.jpeg' alt="Logo" width={96} height={96} className="rounded-lg" />
                </div>
                <div>
                    <h1 className="text-white text-2xl font-bold text-center mb-6">Login</h1>
                    <form className="space-y-4" onSubmit={handleFormSubmit}>
                        <div className="flex flex-col">
                            <label className="text-white text-sm mb-2">Username</label>
                            <input 
                                type="text" 
                                placeholder='Username' 
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className="input bg-white text-black placeholder-gray-300 input-bordered h-10 rounded-md px-4 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        
                        <div className="flex flex-col">
                            <label className="text-white text-sm mb-2">Password</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder='Password' 
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full input bg-white text-black placeholder-gray-300 input-bordered h-10 rounded-md px-4 focus:ring-2 focus:ring-blue-500"
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                        </div>

                        <div className="text-white mb-2">
                            <Link href="/forgot-password">Forgot Password?</Link>
                        </div>

                        <button 
                            type="submit"
                            className="btn w-full rounded-lg py-2 bg-[#003465] text-white font-semibold text-lg hover:bg-[#002C4F] transition"
                        >
                            {isPending ? "Loading..." : "Login"}
                        </button>

                        {isError && <p className="text-red-500 mt-2">Something went wrong</p>}

                        <div className="text-center text-white my-4">or Continue with</div> 

                        <div className="flex justify-center gap-2">
                            <div className="bg-white rounded-md">
                                <button onClick={()=>signIn("google")} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-100 transition">
                                    <FcGoogle size={20} />
                                </button>
                            </div>
                            <div className="bg-white rounded-md">
                                <button onClick={()=>{signIn("facebook")}} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-100 transition">
                                    <FaFacebook size={20} className="text-blue-500" />
                                </button>
                            </div>
                            <div className="bg-white rounded-md">
                                <button onClick={()=>{signIn("github")}} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-black hover:bg-gray-100 transition">
                                    <FaGithub size={20} className="text-blue-600" />
                                </button>
                            </div>
                          
                        </div>

                        <div className="text-white mt-4 text-center">
                            <span>Don't have an account yet?</span> 
                            <Link href="/auth/signup" className="font-bold ml-1">Register for free</Link>
                        </div>
                    </form>
                </div>
            </div>
       </div>
    );
}
