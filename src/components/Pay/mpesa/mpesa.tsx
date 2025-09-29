
'use client';
import { useState } from "react"
import STKPushQueryLoading from "./stkQueryLoading";
import PaymentSuccess from "./success";

// import { useRouter } from "next/navigation";

export default function Mpesa () {
    // const [ dataFromForm, setDataFromForm]= useState<dataFromForm>({
    //     mpesa_phone: "",
    //     name: "",
    //     amount: 0,
    // });
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [loading, ] = useState <boolean> (false);
  const [success,] = useState<boolean>(false);
  const [stkQueryLoading, ] = useState<boolean>(false);
//   const [setError,setErrorMessage] = useState<string>('');
  const [status, setStatus] = useState("PENDING");
//   const router = useRouter();  

   
const handlePay = async (e: React.FormEvent) => {
       e.preventDefault();
      const res = await fetch("/api/mpesa/stk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount }),
      });
      const data = await res.json();
        // const {checkoutRequestId }  = await res.json();
        const {checkoutRequestId }  = data;
        
    //   const checkoutRequestId = data.CheckoutRequestID;
    //   const { checkoutRequestId } = response.data;
       console.log(data);
    

    const interval = setInterval(async () => {
    const statusRes = await fetch(`/api/mpesa/status?checkoutRequestId=${checkoutRequestId}`);
    const statusData = await statusRes.json();

    if (statusData.status !== "PENDING") {
        clearInterval(interval);
        // redirect to JamboAI page if success
        if (statusData.status === "SUCCESS") {
        window.location.href = "/JamboAI";
        setStatus
        }
    }
}, 3000);
    };
    

//     useEffect(() => {
//          if (!checkoutRequestId) return;
//         const interval = setInterval(async () => {
            
//             const res = await fetch(`/api/mpesa/status?checkoutRequestId=${checkoutRequestId}`);
//             const data = await res.json();
            
            
//             if (data.status === "SUCCESS") {
//         clearInterval(interval);
//         router.push("/JamboAI"); // redirect after success
//       }
//       setStatus(data.status);
//         }, 4000);
//         return() => clearInterval(interval);
//     }, [checkoutRequestId,router]);

// };
  
//     if (!checkoutRequestId) return;
//     const interval = setInterval(async () => {
//       try {
        
//         const res = await fetch(`/api/mpesa/status?checkoutRequestId=${checkoutRequestId}`);
//         if (!res.ok) return;
//         const data = await res.json();

//         setStatus(data.status);

//         // Stop polling once we have final status
//         // if (data.status === "SUCCESS" || data.status === "FAILED") {
//         //   clearInterval(interval);
//         // }
        
//       } catch (err) {
//         console.error("Polling error:", err);
//       }
//     }, 5000); // poll every 5 sec

//     // Cleanup when component unmounts
//     return () => clearInterval(interval);
//   }, [checkoutRequestId]);



  
    return (
        <div className="bg-gray-100  py-4 px-4 flex justify-center items-center">
            {stkQueryLoading ?  (
                 <STKPushQueryLoading number={phone}/>
            ): success ? (
                <PaymentSuccess/> 
            ) : (
        <div className="lg:pl-12">
            <div className="overflow-hidden rounded-md bg-white">
                <div className="p-6 sm:p-10">
                    <div>Payment Status: {status}</div>
                     

                    <form onSubmit={handlePay}  className="mt-4 ">

                        <h2 className="text-xl font-semibold mb-2">Choose a Plan</h2>
                         <div className="flex gap-2">
                            <button
                            type="button"
                            onClick={() => setAmount(100)}
                            className={`px-4 py-2 rounded-lg border ${
                                amount === 100 ? "bg-blue-600 text-white" : "bg-gray-100"
                            }`}
                            >
                            Basic – 100
                            </button>
                            <button
          type="button"
          onClick={() => setAmount(500)}
          className={`px-4 py-2 rounded-lg border ${
            amount === 500 ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Pro – 500
        </button>
        <button
          type="button"
          onClick={() => setAmount(1000)}
          className={`px-4 py-2 rounded-lg border ${
            amount === 1000 ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
        >
          Enterprise – 1000
        </button>

                            </div>
                        <div className="space-y-6">
                            {/* <div> */}
                                {/* <label className="text-base font-medium text-gray-900">
                                    {""}
                                    Name {""}
                                </label>
                                <div className="relative mt-2.5">
                                    <input
                                    type="text"
                                    required
                                    name="name"
                                    value={dataFromForm.name}
                                    onChange={(e) => setDataFromForm({...dataFromForm, name:e.target.value})}
                                    placeholder="name"
                                    className="block w-full rounded-md border border-gray-200 bg-white px-4 py-4 text-black placeholder-gray-500 caret-orange-500 transition-all duration-200 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                                    >
                                    </input>
                                </div>
                            </div> */}
                            <div>
                                <label className="text-base font-medium text-gray-900">
                                    
                                    Mpesa Number 
                                </label>
                                <div className="relative mt-2.5">
                                    <input 
                                    // type="text"
                                    // name="mpesa_number"
                                    // value={dataFromForm.mpesa_phone}
                                    // // readOnly
                                    // onChange={(e) => setDataFromForm({
                                    //     ...dataFromForm,
                                    //     mpesa_phone:e.target.value
                                    // })}
                                    // placeholder="Mpesa phone number"
                                    // className="border p-2 mr-2"
                                    type="text"
                                    name="mpesa_number"
                                    placeholder="2547XXXXXXXX"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                    
                                    className="block w-full rounded-md border border-gray-200 bg-white px-4 py-4 text-black placeholder-gray-500 caret-orange-500 transition-all duration-200 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-base font-medium text-gray-900">
                                
                                Amount
                                </label>
                                 <div className="relative mt-2.5">
                                    <input
                                        // type="number"
                                        // required
                                        // name="amount"
                                        // value={dataFromForm.amount}
                                        // onChange={(e) =>
                                        // setDataFromForm({
                                        //     ...dataFromForm,
                                        //     amount: Number(e.target.value),
                                        // })
                                        // }
                                        // placeholder="Enter an active whatsapp number"
                                        type="number"
                                        // name="amount"
                                        placeholder="Amount"
                                        // value={amount}
                                        // onChange={(e) => setAmount(e.target.value)}
                                        value={amount ?? ""}
                                        readOnly
                                        required
                                        className="block w-full rounded-md border border-gray-200 bg-white px-4 py-4 text-black placeholder-gray-500 caret-orange-500 transition-all duration-200 focus:border-orange-500 focus:outline-none focus:ring-orange-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <button
                                type="submit"
                                disabled={loading ||  !amount}
                                // onClick={handleSubmit}
                                className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-green-800 px-4 py-4 text-base font-semibold text-white transition-all duration-200 hover:bg-orange-600 focus:bg-orange-600 focus:outline-none"
                                >
                                   {loading ? "Processing.." : "Pay"} 
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
            )}
    </div>
    )
}
// "use client";
// import axios from "axios";
// import { useState } from "react"
// export default function Pay() {
//   const [amount, setAmount] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [accountReference, setAccountReference] = useState('');
//   const [transactionDesc, setTransactionDesc] = useState('');
//   const handlePayment = async (e: { preventDefault: () => void; }) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('/api/mpesa', {
//         amount,
//         phoneNumber,
//         accountReference,
//         transactionDesc,
//       });
//       console.log(response.data);
//     } catch (error) {
//       console.error('Payment Error:', error);
//     }
//   };
//   return (
//     <div>
//       <h1>M-Pesa Payment</h1>
//       <form onSubmit={handlePayment}>
//         <input
//           type="text"
//           placeholder="Amount"
//           value={amount}
//           onChange={(e) => setAmount(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Phone Number"
//           value={phoneNumber}
//           onChange={(e) => setPhoneNumber(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Account Reference"
//           value={accountReference}
//           onChange={(e) => setAccountReference(e.target.value)}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Transaction Description"
//           value={transactionDesc}
//           onChange={(e) => setTransactionDesc(e.target.value)}
//           required
//         />
//         <button type="submit">Pay Now</button>
//       </form>
//     </div>
//   );
// }

