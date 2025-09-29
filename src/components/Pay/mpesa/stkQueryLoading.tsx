// export default function STKPushQueryLoading({number}:{number:string}) {
//     return (
//       <div className="space-y-2 text-center text-black p-10 bg-gray-100">
//         <h1 className="animate-pulse">PROCESSING PAYMENT..</h1>
//         <h1>Stk push sent to {number}</h1>
//         <h1>Enter Pin to confirm payment</h1>
//       </div>
//     );
//   }
interface STKPushQueryLoadingProps {
  number: string
}

export default function STKPushQueryLoading({ number }: STKPushQueryLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Processing Payment</h3>
      <p className="text-gray-600 text-center">
        Please check your phone ({number}) for the M-Pesa prompt and enter your PIN to complete the payment.
      </p>
    </div>
  )
}



  // "use client";
  // import { useState } from "react";
  
  // export default function Mpesa() {
  //   const [phone, setPhone] = useState("");
  //   const [amount, setAmount] = useState("");
  
  //   const handlePay = async () => {
  //     const res = await fetch("/api/mpesa/stk", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ phone, amount }),
  //     });
  //     const data = await res.json();
  //     console.log(data);
  //   };
  
  //   return (
  //     <div className="p-6">
  //       <input
  //         className="border p-2 mr-2"
  //         type="text"
  //         placeholder="2547XXXXXXXX"
  //         value={phone}
  //         onChange={(e) => setPhone(e.target.value)}
  //       />
  //       <input
  //         className="border p-2 mr-2"
  //         type="number"
  //         placeholder="Amount"
  //         value={amount}
  //         onChange={(e) => setAmount(e.target.value)}
  //       />
  //       <button className="bg-green-600  p-2" onClick={handlePay}>
  //         Pay with M-Pesa
  //       </button>
  //     </div>
  //   );
  // }
  
  