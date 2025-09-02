"use client";

import { ResetPasswordFormValidation, ResetPasswordFormValidationType } from "@/app/lib/validations";
import { EyeIcon, EyeSlashIcon, KeyIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useRouter } from "next/navigation";
import {FormEvent, useEffect, useState} from "react";
import toast from "react-hot-toast";
import z from "zod";




export default function ResetPassword() {
    const [token, setToken] = useState("");
    const [password, setPassword] = useState<ResetPasswordFormValidationType>({
        password: ""
    });
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword,setShowPassword]= useState(false);
    const [, setError] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});


    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);


    const resetPassword = async (e:FormEvent<HTMLFormElement> ) => {
         setLoading(true);
        e.preventDefault()
        setFormErrors({});
        try{
           
            ResetPasswordFormValidation.parse(password);
            await axios.post("/api/users/resetPassword", {
                token,
                password,
            });
            toast.success("Password reset successfully");
            router.push("/login");
    //     } catch (err: unknown) {
    //         const error = err as AxiosError<{message: string}>;
    //         if (error.response?.data?.message) {
    //             console.log(error.response.data.message);
    //             toast.error(error.response.data.message);
    //         } else if (error.message) {
    //             console.log(error.message);
    //             toast.error(error.message);
    //         } else{
    //             toast.error("Something went wrong");
    //         }
          
    //     } finally {
    //         setLoading(false);
    //     }
    // };
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


    return (
        <div className = "flex items-center justify-center flex-col gap-0.5 min-h-screen p-4  bg-gray-300">
            <h1 className="font-bold text-2xl mb-4">Reset Your Password</h1>
            <form onSubmit={resetPassword}  className="flex flex-col grid-cols-1 gap-0.5 w-full max-w-sm mr-2 ml-2  bg-gray-200 shadow-md border-2 border-gray-200 rounded-2xl px-2 py-4">
                <div>
            <label htmlFor="password">New Password</label>
            <div className="relative">
            <input
            id="password"
            type={showPassword ? "text": "password"}
            placeholder="Enter new password"
            className="peer block w-full border-2 border-gray-300 focus:outline-none
             focus:border-gray-600 rounded-md p-2 mb-4 pl-10 py-[9px]"
            value={password.password}
            onChange={(e) => setPassword((prev) => ({...prev, password:e.target.value}))}
            required
            minLength={8}
            />

           <KeyIcon className="pointer-events-none absolute left-3 top-1/2
            h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

            <button
             type="button"
             onClick={() => setShowPassword(!showPassword)}
             className = "absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-900"
            >
                {showPassword? (
                    <EyeSlashIcon className="h-5 w-5" />    
                ): (
                    <EyeIcon className="h-5 w-5" />    
                )
                
                }

            </button>

            {/* <label htmlFor="confirm-password">Confirm Password</label>
            <input
            
            id="password"
            type="password" 
            placeholder="Confirm new password" 
            className="border-2 border-gray-300 focus:outline-none focus:border-gray-600  rounded-md p-2 mb-4" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            /> */}
            </div>
            {formErrors.password && <span className="text-red-500">{formErrors.password}</span>}

            </div>
            <button
                // onClick={resetPassword}
                type="submit"
                className= "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200 ease-in-out"
                // disabled={password.length < 6} // Disable button if password is less than 6 characters
                disabled={loading}
                >
                    Reset Password
                    {loading && <span className="ml-2">Loading...</span>}
            </button>
        </form>
        </div>
    )
}