"use client";
import useAuth from "@/context/useAuth";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Header () {
    // const [isLoginModalOpen,setLoginModalOpen] = useState(false);
 const { authStatus,setAuthStatus} = useAuth(); 
 const router = useRouter();

//   const handleClick = () => {
//     if (authStatus) {
//       // if logged in  go to payment
//     //   setAuthStatus(true)
//       router.push("/pay");
//     } else {
//       // if not logged in  go to JamboAI page
//     //   setAuthStatus(false)
//       router.push("/JamboAI");
//     }
//   };
  
   const logout = async () =>  {
        try{
            await axios.get("/api/users/logout")
            toast.success("Logout successfully")
             setAuthStatus(false);
            router.push("/signIn")
             
        } catch(err: unknown) {
            const error = err as AxiosError<{message: string}>;
            
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else if (error.message) {
                toast.error(error.message);
            } else{
                toast.error("Something went wrong")
            }
            
        }
    }
    return (
        <div className="sticky min-h-fit top-0 z-50">
            <nav className="bg-white shadow-sm py-4  ">
                <div className="container mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center">
                        
                        <Link href="/" className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                            jambo</Link>
                            <span className="ml-3 text-xl font-semibold text-blue-800">jambo.AI</span>
                        </div>
                        
                        <div className="hidden md:flex space-x-8">
                            <Link href="#features" className="text-gray-600 hover:text-blue-600">Features</Link>
                            <Link href="#pricing" className="text-gray-600 hover:text-blue-600">Pricing</Link>
                            <Link href="#faq" className="text-gray-600 hover:text-blue-600">FAQ</Link>
                        </div>
                        {/* <a href="/signIn"                         
                        className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"

                        > */}
                        {/* <button
                         onClick={() => setLoginModalOpen(true)} */}
                        {/* > */}
                            {/* Sign In */}
                        {/* </button> */}
                        {/* </a> */}

                         {authStatus ? (
        // If logged in → show Sign Out
        // <button
        // //   onClick={setAuthStatus}
        // onClick={handleClick}
        //   className="bg-red-600  hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
        // >
        //   Sign Out
        // </button>
          <button 
            onClick={logout}
            className="bg-blue-500 cursor-pointer hover:bg-blue-700 rounded-lg text-white font-medium py-2 px-4 p-3 mt-4 transition-colors">
                Sign Out
                </button>
      ) : (
        // If not logged in → show Sign In
        <a
          href="/signIn"
          className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
        >
          Sign In
        </a>
      )}
      
                    </div>
                
            </nav>


            

         </div>
    )
} 