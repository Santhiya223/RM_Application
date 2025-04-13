"use client"

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const isPending = false;
    const isError = false;

    const handleInputChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value});
        
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);

        setLoading(true);

        try{
            const response = await fetch("/api/auth/signup", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({username:formData.username, password:formData.password, email: formData.email})
            })

            if(response.ok) {
                const data = response.json();
                toast.success("Sign up succesfully");
                router.push("/auth/login");
            }
        } catch(ex) {
            console.error(`error in signup: ${ex}`)
            toast.error(errorData.message || 'Login failed');
        } finally {
            setLoading(false);
          }
    }

    return (
       <div className="h-screen flex items-center justify-center ">
            <div className="w-full max-w-sm p-6 bg-opacity-30 backdrop-blur-lg border rounded-xl shadow-lg bg-radial from-[#0085FF] via-[hsl(209,48%,46%)] to-[#003465]">
                <div className="flex items-center justify-center pb-4">
                    <Image src='/images/logo1.jpeg' alt="Logo" width={96} height={96} className="rounded-lg" />
                </div>
                <div>
                    <h1 className="text-white text-2xl font-gilroy font-bold text-center mb-6">Signup</h1>
                    <div>
                        <form className="space-y-4" onSubmit={handleFormSubmit}>
                            <div className="flex flex-col">
                                <label className="label">
                                    <span className="text-white text-sm mb-2">Username</span>
                                </label>
                                <input type="text" placeholder='Username' value={formData.username} onChange={handleInputChange}  name="username" className="input bg-white text-black placeholder-gray-300 input-bordered h-10 rounded-md px-4 focus:ring-2 focus:ring-blue-500"/>
                            </div>
                            <div className="flex flex-col">
                                <label className="label">
                                    <span className="text-white text-sm mb-2">Email</span>
                                </label>
                                <input type="email" placeholder='username@gmail.com' value={formData.email}  onChange={handleInputChange} name = 'email' className="input bg-white text-black placeholder-gray-300 input-bordered h-10 rounded-md px-4 focus:ring-2 focus:ring-blue-500"/>
                            </div>
                            <div className="flex flex-col">
                                <label className="label">
                                    <span className="text-white text-sm mb-2">Password</span>
                                </label>
                                <div className="relative w-83">
                                    <input type={showPassword ? "text":"password"} placeholder='Password' value={formData.password} onChange={handleInputChange} name="password" className="w-full input bg-white text-black placeholder-gray-300 input-bordered h-10 rounded-md px-4 focus:ring-2 focus:ring-blue-500"/>
                                    <button onClick={()=>{setShowPassword(!showPassword)}} type="button" className="absolute inset-y-0 right-3 flex items-center text-gray-600">{showPassword? <EyeOff /> :<Eye />}</button>
                                </div>
                            </div>
                            <div className="flex flex-col mt-4">
                                <button className="btn btn-block w-full rounded-lg py-2 bg-[#003465] text-white font-semibold text-lg hover:bg-[#002C4F] transition">{isPending ? "Loading" : "Sign up"}</button>
                                {isError && <p className='text-red-500'>{error.message}</p>}
                            </div>
                            
                        </form>
                        <div className="text-white">
                                <span>Already have an account?</span> <Link href="/auth/login"><span className="font-bold">Sign in</span></Link>
                            </div>
                    </div>
                    
                </div>
               
            </div>
       </div>
    );
}