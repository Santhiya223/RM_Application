"use client"
import { useAuth } from "@/context/AuthContext";
import AdminDashboard from "@/components/AdminDashBoard";
import UserDashboard from "@/components/UserDashboard";

export default function Dashboard() {
  const { userData } = useAuth();
  console.log(`djflgdljg${userData.isAdmin}`);
  if (!userData || userData.isAdmin === undefined) {
    return <p>Loading...</p>;
  }

  console.log("User Data in Dashboard:", userData); // Debugging

  return userData.isAdmin === true || userData.isAdmin === "true" ? <AdminDashboard /> : <UserDashboard />;
}
