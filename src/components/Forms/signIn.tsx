"use client";

import React, { FormEvent, useEffect, useState } from "react"
import Link from "next/link";
import { useRouter } from 'next/navigation';
import axios from "axios";
import toast from "react-hot-toast";
import { AtSymbolIcon, EyeIcon, EyeSlashIcon, KeyIcon } from "@heroicons/react/24/outline";
import { LoginFormValidation, LoginFormValidationType } from "@/app/lib/validations";
import z from "zod";


export default function Login() {
    const router  = useRouter();
      const [user, setUser] = React.useState<LoginFormValidationType>({
           
            email:"",
            password:"",
            
        })
        const [buttonDisabled, setButtonDisabled] = React.useState(false);
        const [loading, setLoading] = React.useState(false);
        const [showPassword, setShowPassword] = useState(false);
        const [, setError] = React.useState(false);

        const [formErrors, setFormErrors] = useState<Record<string, string>>({});
     
    
        const onLogin = async (e:FormEvent<HTMLFormElement> )=> {
             e.preventDefault()
            setLoading(true);
            setFormErrors({});
        
            try{
               
                LoginFormValidation.parse(user);
                const response = await axios.post("/api/users/login", user);
                console.log("Login success", response.data);
                toast.success("Login success");
                router.push("/pay");
                
            } catch(err: unknown){
                
                
                setError(true);

                // if (error.response?.data?.message, err instanceof z.ZodError){
                 if ( err instanceof z.ZodError){ //!result.success
                    const errors:Record<string, string> = {};
                    // const error = err as AxiosError<{message: string}>;
                    err.errors.forEach(e => {
                    if (e.path[0]) errors[e.path[0] as string] = e.message;
                    });
                     setFormErrors(errors);
                    // console.log(error.response.data.message);
                   
                    // toast.error(error.response.data.message);
                    toast.error("Validation error.Please check your inputs");
                // } else if (error.message) {
                //     console.log(error.message);
                //     toast.error(error.message);
                 } else if (axios.isAxiosError(err)) {
                    const message = err.response?.data?.message || err.message || "Request failed";
                     console.log(message);
                    toast.error(message);
                 }
                else {
                   
                    toast.error("Something went wrong");
                }

            } finally {
                setLoading(false);
            }
    
        }

        useEffect(() => {
            if(user.email.length > 0 && user.password.length > 0) {
                setButtonDisabled(false);
            } else {
                setButtonDisabled(true);
            }
        }, [user]);

     
        
    return (

            <div className="flex  flex-col items-center justify-center min-h-screen  bg-gray-300 ">
            <h1>{loading ? "Processing..." : "Login"}</h1>
            <hr/>
            {/* <form className="flex flex-col grid-cols-1 gap-0.5 px-4 py-4 border-2 border-gray-600 rounded-2xl w-full max-w-md"> */}
              <form onSubmit={onLogin} className="w-full flex  flex-col grid-cols-1 gap-0.5 m-2 py-4 px-4
                 border-2 border-gray-200 rounded-2xl  max-w-sm bg-gray-200 shadow-md ml-4 mr-4 ">
               
                <div className="w-full">
                   
                  <label
                //   className="mb-3 mt-5 block text-xs font-medium text-gray-900"
                  htmlFor="email">email
                  </label>
                  <div className="relative">
            <input
            className='peer block w-full border-2 border-gray-300 focus:outline-none focus:border-gray-600
             rounded-md p-2 mb-4 py-[9px] pl-10 text-sm  placeholder:text-gray-500'
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser((prev) =>  ({...prev, email: e.target.value}))}
            placeholder='email'
            required
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 
            top-1/2 h-[18px] w-[w-18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
            </div>
                          {formErrors.email && <span className="text-red-500">{formErrors.email}</span>}

            </div>
           
            
             <div>
            <label htmlFor="password">password</label>
            <div className="relative">
            <input
            className='peer block w-full border-2 border-gray-300 focus:outline-none
             focus:border-gray-600 rounded-md p-2 mb-2 py-[9px] pl-10 text-sm  placeholder:text-gray-500'
            id="password"
            value={user.password}
            onChange={(e) => setUser((prev) => ({...prev, password: e.target.value}))}
            placeholder='password'
            required
            type={showPassword ? "text" : "password"}
            minLength={8}
         
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px]
             w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"
             />

             <button
             type = "button"
             onClick={() => setShowPassword(!showPassword)}
             className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-900">
                {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5"/>
                ) : (
                    <EyeIcon className="h-5 w-5"/>
                )}
            </button>
          
            </div>
                {formErrors.password && <span className="text-red-500">{formErrors.password}</span>}

            </div>
          

            <button 
            // onClick={onLogin}
            type="submit"
            className='bg-blue-500 text-white rounded-md p-2 mb-4'> 
             {buttonDisabled ? "Please fill in the form" : "Login"}
                
                </button>
            <p>Dont have an account? <Link href="/signUp" className='text-blue-500'>SignUp</Link></p>
            <p>Forgot Password? <Link href="/forgotPassword" className='text-blue-500'>ForgotPassword</Link></p>
            </form>
            {/* </div> */}
        </div>

        
    )
}