// // import { connect } from "@/dbConfig/dbConfig";
// // import transaction from "@/models/transaction";
// // import { NextResponse } from "next/server";

// // export async function GET(req: Request) {
// //     await connect();
// //      const { searchParams } = new URL(req.url);
// //     const checkoutRequestId = searchParams.get("checkoutRequestId");

// //      if (!checkoutRequestId) {
// //     return NextResponse.json({ message: "Missing checkoutRequestId" }, { status: 400 });
// //    }

// //    const txn = await transaction.findOne({ checkoutRequestId });
// //     if (!txn) {
// //     return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
// //   }
// //    return NextResponse.json({ status: txn.status });
// // }
// // /api/mpesa/status.ts
// import { connect } from "@/dbConfig/dbConfig";
// import transaction from "@/models/transaction";
// import { NextResponse } from "next/server";

//  connect();

// export  async function GET(req: Request) {

//   try { 
   
//     const { searchParams } = new URL(req.url);
//     const checkoutRequestId = searchParams.get("checkoutRequestId");

//      if (!checkoutRequestId) {
//     return NextResponse.json({ message: "Missing checkoutRequestId" }, { status: 400 });
//    }
//     // const { checkoutRequestId } = req.query;

//     const tx = await transaction.findOne({ checkoutRequestId });

//    if (tx.status === "PENDING") {
//       return NextResponse.json({ status: "PENDING" });
//     }

//     if (tx.status === "PENDING") {
//       return NextResponse.json({ status: "PENDING" });
//     }

//     if (tx.status === "SUCCESS") {
//       return NextResponse.json({ status: "SUCCESS" });
//     }

//     return NextResponse.json({ status: tx.status });
//   } catch (err) {
//     // return NextResponse.status(500).json({ status: "ERROR" });
//     console.error("Error fetching mpesa status:", err);
//      return NextResponse.json({ status: "ERROR" }, {status: 500});
//   }
// }


import { connect } from "@/dbConfig/dbConfig"
import transaction from "@/models/transaction"
import { type NextRequest, NextResponse } from "next/server"

connect()

// Function to get M-Pesa access token
async function getAccessToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")

  const response = await fetch("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
    headers: {
      Authorization: `Basic ${auth}`,
    },
  })

  const data = await response.json()
  return data.access_token
}

async function queryStkStatus(checkoutRequestId: string) {
  try {
    const accessToken = await getAccessToken()

    // Generate timestamp
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, 14)

    // Generate password
    const businessShortCode = process.env.MPESA_BUSINESS_SHORT_CODE
    const passkey = process.env.MPESA_PASSKEY
    const password = Buffer.from(`${businessShortCode}${passkey}${timestamp}`).toString("base64")

    const response = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: businessShortCode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      }),
    })

    const data = await response.json()
    console.log(" STK Query Response:", JSON.stringify(data, null, 2))
    return data
  } catch (error) {
    console.error(" STK Query error:", error)
    return null
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const checkoutRequestId = searchParams.get("checkoutRequestId")

    if (!checkoutRequestId) {
      return NextResponse.json({ error: "checkoutRequestId is required" }, { status: 400 })
    }

    console.log(" Checking status for checkoutRequestId:", checkoutRequestId)

    const tx = await transaction.findOne({ checkoutRequestId })

    if (!tx) {
      console.log(" Transaction not found for checkoutRequestId:", checkoutRequestId)
      return NextResponse.json({ status: "PENDING", message: "Transaction not found" }, { status: 200 })
    }

    if (tx.status === "PENDING") {
      console.log(" Transaction is PENDING, querying M-Pesa for current status")
      const stkQueryResult = await queryStkStatus(checkoutRequestId)

      if (stkQueryResult) {
        const resultCode = String(stkQueryResult.ResultCode)

        // ResultCode: "0" = Success, "1032" = Cancelled by user, "1037" = Timeout, other = Failed
        if (resultCode === "0") {
          tx.status = "SUCCESS"
          tx.resultCode = resultCode
          tx.resultDesc = stkQueryResult.ResultDesc || "Payment successful"
          await tx.save()
          console.log(" Payment confirmed as SUCCESS via STK Query")
        } else if (resultCode === "1032") {
          tx.status = "FAILED"
          tx.resultCode = resultCode
          tx.resultDesc = "Payment cancelled by user"
          await tx.save()
          console.log(" Payment cancelled by user")
        } else if (resultCode === "1037") {
          tx.status = "FAILED"
          tx.resultCode = resultCode
          tx.resultDesc = "Payment timeout - user did not enter PIN"
          await tx.save()
          console.log(" Payment timeout")
        } else if (resultCode && resultCode !== "1001") {
          // 1001 means still processing, keep as PENDING
          tx.status = "FAILED"
          tx.resultCode = resultCode
          tx.resultDesc = stkQueryResult.ResultDesc || "Payment failed"
          await tx.save()
          console.log(" Payment failed with code:", resultCode)
        } else {
          console.log(" Payment still processing (code 1001 or no result code)")
        }
      }
    }

    console.log(" Returning transaction status:", tx.status)

    return NextResponse.json({
      status: tx.status || "PENDING",
      resultCode: tx.resultCode,
      resultDesc: tx.resultDesc,
      mpesaReceiptNumber: tx.mpesaReceiptNumber,
    })
  } catch (error) {
    console.error(" Status check error:", error)
    return NextResponse.json({ error: "Internal server error", status: "PENDING" }, { status: 500 })
  }
}
