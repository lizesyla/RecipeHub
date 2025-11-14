import React from "react";
import { useAuth } from "../../../context/AuthContext";

export default function Logout() {
  const { signOut } = useAuth();
  
  React.useEffect(() => {
    signOut(); 
  }, []);
  
  return null;
}