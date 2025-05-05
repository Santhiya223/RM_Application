"use client"
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
const AuthContext = createContext(undefined);

export const AuthProvider = ({children})=> {
    const [userData, setUserData] = useState({});
    const router = useRouter();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("UserData"));
        if (storedUser) {
            setUserData(storedUser);
        }
    }, []);

    const login = async (formData) => {
      const result = await signIn("credentials", {
        redirect: false,
        username: formData.username,
        password: formData.password,
      });
    
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Login successful");
        router.push("/dashboard");
      }
    };
    

    const logout = async () => {
      try {
        await signOut({ redirect: true, callbackUrl: "/auth/login" });
        localStorage.removeItem("UserData");
        setUserData({});                     
      } catch (ex) {
        console.error(`error in logout: ${ex}`);
        toast.error("Logout failed");
      }
    };
    

    return (
        <AuthContext.Provider value={{login,userData,logout}}>{children}</AuthContext.Provider>
    )
}

export const useAuth = ()=> {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
      }
      return context;
}