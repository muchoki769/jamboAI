"use client"
import { useState, useRef } from "react"
import React from "react"

import type { ReactElement } from "react"

import STKPushQueryLoading from "./stkQueryLoading"
import PaymentSuccess from "./success"

export default function Mpesa(): ReactElement {
  const [phone, setPhone] = useState("")
  const [amount, setAmount] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [stkQueryLoading, setStkQueryLoading] = useState<boolean>(false)
  const [status, setStatus] = useState("PENDING")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const handlePay = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    setStkQueryLoading(true)
    setStatus("PENDING")

    try {
      const res = await fetch("/api/mpesa/stk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount }),
      })
      const data = await res.json()
      const { checkoutRequestId } = data

      console.log("Payment initiated with checkoutRequestId:", checkoutRequestId)

      intervalRef.current = setInterval(async () => {
        try {
          console.log("Polling status for checkoutRequestId:", checkoutRequestId)
          const statusRes = await fetch(`/api/mpesa/status?checkoutRequestId=${checkoutRequestId}`)
          const statusData = await statusRes.json()

          console.log("Status response:", statusData)
          setStatus(statusData.status)

          if (statusData.status !== "PENDING") {
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
              intervalRef.current = null
            }
            setStkQueryLoading(false)
            setLoading(false)

            if (statusData.status === "SUCCESS") {
              console.log("Payment successful, showing success message")
              setSuccess(true)
              setTimeout(() => {
                console.log("Redirecting to JamboAI")
                window.location.href = "/JamboAI"
              }, 2000)
            } else if (statusData.status === "FAILED") {
              console.log("Payment cancelled or failed with status:", statusData.status)
              // Reset form state to allow retry
              setStatus("CANCELLED")
            } else {
              console.log("Payment completed with status:", statusData.status)
            }
          }
        } catch (error) {
          console.error("Status check error:", error)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          setStkQueryLoading(false)
          setLoading(false)
        }
      }, 3000)
    } catch (error) {
      console.error("Payment error:", error)
      setLoading(false)
      setStkQueryLoading(false)
    }
  }

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [])

  return (
    <div className="bg-gray-100 py-4 px-4 flex justify-center items-center">
      {stkQueryLoading ? (
        <STKPushQueryLoading number={phone} />
      ) : success ? (
        <PaymentSuccess />
      ) : (
        <div className="lg:pl-12">
          <div className="overflow-hidden rounded-md bg-white">
            <div className="p-6 sm:p-10">
              <div className={`mb-4 ${status === "CANCELLED" ? "text-red-600" : ""}`}>
                Payment Status: {status === "CANCELLED" ? "Payment was cancelled. You can try again." : status}
              </div>

              <form onSubmit={handlePay} className="mt-4">
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
                  <div>
                    <label className="text-base font-medium text-gray-900">Mpesa Number</label>
                    <div className="relative mt-2.5">
                      <input
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
                    <label className="text-base font-medium text-gray-900">Amount</label>
                    <div className="relative mt-2.5">
                      <input
                        type="number"
                        placeholder="Amount"
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
                      disabled={loading || !amount}
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
