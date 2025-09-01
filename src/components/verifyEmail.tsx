"use client";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import React,{useCallback, useEffect,useState} from "react";

export default function VerifyEmail() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    const verifyUserEmail = useCallback( async () => {
        try{
            await axios.post('/api/users/verifyemail',
                {token})
            setVerified(true);
        } catch (err: unknown) {
            const error = err as AxiosError<{message: string}>;
            if (error.response?.data?.message) {
                console.log(error.response.data.message);
            } else if (error.message) {
                console.log(error.message);
            } else {
                console.log("Something went wrong");
            }
            setError(true);
            
        }
    }, [token]);
    
    useEffect(() => {
        const urlToken = window.location.search.split("=") [1];
        setToken(urlToken || "");
    },[token])

    useEffect(() => {
       if(token.length > 0) {
        verifyUserEmail();
       } 
    },[token,verifyUserEmail]);

    return(
        <div className="flex items-center justify-center flex-col m-2  min-h-screen  py-2 bg-gray-200 ">
            <h1 className="text-4xl"> Verify Email</h1>
            <div className=" flex flex-col grid-cols-2 gap-0.5 rounded-2xl max-w-sm ml-2 mr-2 border-2 border-gray-600 py-2 px-4">
            {/* <h2 className="p-2 bg-blue-400 rounded-md py-2 px-4 m-2">{token ? `${token}` : "no token" }</h2> */}

            {verified && (
                <div>
                    <h2 className="text-2xl bg-blue-500 ">Email Verified</h2>
                    <Link href="/signIn">
                        Login
                    </Link>
                </div>
            )}
            {error && (
                <div>
                    <h2 className="text-2xl  bg-red-500 rounded-md py-2 px-4 m-2">Error !, Email Not Verified or token has expired, please sign up or sign in</h2>
                    {/* <div className="mt-2 py-2 px-4 p-2 bg-gray-200 rounded-md hover:bg-blue-300 transition duration-200 ease-in-out">
                    <Link href="/signup">
                        signup
                    </Link>
                    </div> */}
                    <p>Dont have an account? <Link href="/signUp" className='text-blue-500'>SignUp</Link></p>
                </div>
            )}
            </div>
        </div>
    )
}