"use client"
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
    const login = async (formData)=> {
         try {
            const response = await fetch("/api/auth/login", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({username: formData.username, password: formData.password})
            })
    
            if (!response.ok) {
                throw new Error("Login failed");
            }
            
            const data = await response.json();
            localStorage.setItem("UserData",JSON.stringify(data.userData));
            setUserData(data.userData);
            router.push("/dashboard");
        } catch(ex) {
            console.error(`error in login: ${ex}`)
            toast.error(ex.message || 'Login failed');
        }
    }

    const logout = async () => {
        try {
            const response = await fetch("/api/auth/logout", { method: 'POST' });

            if (!response.ok) {
                throw new Error("Logout failed");
            }

            setUserData({});  // Clear user data
            localStorage.removeItem("UserData");
            router.push("/auth/login");  // Redirect to login page
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