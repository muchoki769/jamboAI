"use client";
import { AuthProvider } from "@/context/authContext";
import { useEffect, useState } from "react";
// import appwriteService from "../lib/appwrite/config";
// import { AuthProvider } from "../../../context/authContext";

const ProtectedLayout = ({children} : {children:React.ReactNode}) => {
     const [authStatus, setAuthStatus] = useState(false);
     const [loader, setLoader] = useState(true);
    

    //  useEffect (() => {
    //     appwriteService.isLoggedIn()
    //     .then(setAuthStatus)
    //     .finally(() => setLoader(false));
    //  }, []);

     useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/users/status", { credentials: "include" });
        const data = await res.json();
        setAuthStatus(data.loggedIn); // backend should return { loggedIn: true/false }
        // setAuthStatus(data.authStatus);
        // authStatus && console.log("User is authenticated");
      } catch (err) {
        console.error("Logout failed:", err);
        setAuthStatus(false);
      } finally {
        setLoader(false);
      }
    };
    checkAuth();
  }, []);

  //  const login = async (email: string, password: string) => {
  //   const res = await fetch("/api/users/login", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email, password }),
  //     credentials: "include", // keep session cookie
  //   });
  //   if (res.ok) {
  //     setAuthStatus(true);
  //   }
  //   return res.json();
  // };
  //   const logout = async () => {
  //   await fetch("/api/users/logout", { method: "POST", credentials: "include" });
  //   setAuthStatus(false);
  // };

     return<AuthProvider value={{authStatus, setAuthStatus}}>
      
        { !loader &&(
            <>
            <main className="">{children}</main>
            </>
        )}
        
     </AuthProvider>
}

export default ProtectedLayout;