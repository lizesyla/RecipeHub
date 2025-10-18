import { useRouter } from "expo-router";
import React from "react";

export default function Logout() {
  const router = useRouter();
  React.useEffect(() => {
    router.replace("/"); // kthen te login
  }, []);
  return null;
}