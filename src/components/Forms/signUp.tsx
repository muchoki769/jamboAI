"use client";
import React, { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {toast} from "react-hot-toast";
import axios from "axios";
import { AtSymbolIcon, EyeIcon, EyeSlashIcon, KeyIcon, UserIcon } from "@heroicons/react/24/outline";
import { UserFormValidation, UserFormValidationType } from "@/app/lib/validations";
import z from "zod";



export default function SignUp() {
    const router = useRouter();
    const [user, setUser] = React.useState<UserFormValidationType>({
         username: "", 
         email:"",
        password:"",
      
    })
const [buttonDisabled, setButtonDisabled] = useState(false);
const [loading, setLoading] = React.useState(false);
const [showPassword, setShowPassword] = useState(false);
const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const onSignup = async (e:FormEvent<HTMLFormElement> ) => {
        e.preventDefault()
        setLoading(true);
        setFormErrors({});
        
        try{
           
           UserFormValidation.parse(user);
           const response = await axios.post("/api/users/signUp", user); 
           console.log("Signup success", response.data);
              toast.success("Signup success check your email to verify your account");
              router.push("/signIn");

    //     }catch(error: unknown) {
    //         const err = error as AxiosError<{message: string}>;
    //         if (err.response?.data?.message) {
    //             console.log(err.response.data.message);
    //             toast.error(err.response.data.message);
    //         } else if (err.message) {
    //             console.log(err.message);
    //             toast.error(err.message);
    //         } else {
    //             toast.error("Something went wrong");
    //         }
            
    //     } finally {
    //         setLoading(false);
    //     }

    // }
      } catch(err: unknown){
                    
                    
                    // setError(true);
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


    useEffect(() =>  {
         if(user.email.length > 0 && user.password.length > 
            0 && user.username.length > 0 ) {
            setButtonDisabled(false);
         } else {
            setButtonDisabled(true);
         }
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-300">
            <h1>{loading ? "Processing..." : "Signup"}</h1>
            <hr/>
            {/* <form className="flex flex-col grid-cols-1 gap-0.5 m-2 py-4 px-4 border-2 border-gray-600 rounded-2xl w-full max-w-md"> */}
           {/* <form onSubmit= {onSignup} className=""> */}
            <form onSubmit={onSignup} className="flex flex-col grid-cols-1 gap-0.5 m-2 py-4 px-4 border-2
             border-gray-200 rounded-2xl w-full max-w-sm mr-2 ml-2  bg-gray-200 shadow-md">
                <div className="w-full">
             <div>
            <label htmlFor="name" className="text-base font-medium text-gray-900">Username</label>
            <div className="relative">
            <input
            className='peer block w-full border-2 border-gray-300 focus:outline-none
             focus:border-gray-600 rounded-md p-2 mb-4 pl-10 py-[9px]'
            id="username"
            type="name"
            value={user.username}
            onChange={(e) => setUser((prev) =>  ({...prev, username: e.target.value}))}
            placeholder='name'
            required
            />
            <UserIcon className="pointer-events-none absolute left-3 top-1/2  h-[18px] w-[18px] 
            -translate-y-1/2  text-gray-500 peer-focus:text-gray-900"/>
            </div>
            {formErrors.name && <span className="text-red-500">{formErrors.name}</span>}

            </div>
            

            <div>
                  <label htmlFor="email" className="text-base font-medium text-gray-900">email</label>
                     <div className="relative">
            <input
            className='peer block w-full border-2 border-gray-300 focus:outline-none focus:border-gray-600 
            rounded-md p-2 mb-4 pl-10 py-[9px]'
            id="email"
            type="email"
            value={user.email}
            onChange={(e) => setUser((prev) =>  ({...prev, email: e.target.value}))}
            placeholder='email'
            required
             
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2
               h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            {formErrors.email && <span className="text-red-500">{formErrors.email}</span>}

            </div>
           
                <div>
            <label htmlFor="password">password</label>
            <div className="relative">
            <input
            className='peer block w-full border-2 border-gray-300 focus:outline-none focus:border-gray-600 
            rounded-md p-2 mb-4 pl-10 py-[9px] '
            id="password"
            type={showPassword ? "text":"password"}
            value={user.password}
            onChange={(e) => setUser((prev) =>  ({...prev, password: e.target.value}))}
            placeholder='password'
            required
            minLength={8}
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2
            h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

            <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-2 flex items-center hover:text-gray-900 text-gray-500"
            >
                {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                ):
                <EyeIcon className="h-5 w-5"/>
            }
            </button>
            </div>
            {formErrors.password && <span className="text-red-500">{formErrors.password}</span>}

            </div>

            </div>
            <button
            type="submit"
            // onClick={onSignup}
            className='bg-blue-500 text-white rounded-md p-2 mb-4' 
           >
                {buttonDisabled ? "Please Fill in the form" : "Sign Up"}
                </button>
            <p>Already have an account? <Link href="/signIn" className='text-blue-500'>Login</Link></p>
            
           {/* <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
                {
                    error && (
                        <>
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-500">{error}</p>
                        </>
                    )
                }
                </div> */}
            
            </form>
            {/* </form> */}
        </div>

    )
}