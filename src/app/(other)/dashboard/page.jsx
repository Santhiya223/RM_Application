"use client";

import AdminDashboard from "@/app/(other)/dashboard/components/AdminDashBoard";
import UserDashboard from "@/app/(other)/dashboard/components/UserDashboard";
import { useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;

  const user = session?.user;

  console.log("User Session Data:", user);
  

  return user?.isAdmin ? <AdminDashboard /> : <UserDashboard />;
}
