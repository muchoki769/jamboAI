// export default function PaymentSuccess() {
//   return (
//     <div className="space-y-2 text-center text-black p-10 bg-gray-100">
//       <h1>Your Payment was processed succesfully</h1>
//       <h1>Thank You for your Donation</h1>
//     </div>
//   );
// }
export default function PaymentSuccess() {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-lg">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Successful!</h3>
      <p className="text-gray-600 text-center mb-4">
        Your payment has been processed successfully. Redirecting to JamboAI...
      </p>
    </div>
  )
}
