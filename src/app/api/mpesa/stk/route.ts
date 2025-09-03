// import { NextResponse } from "next/server";

// function getTimestamp() {
//   const date = new Date();
//   return date.getFullYear().toString() +
//     ("0" + (date.getMonth() + 1)).slice(-2) +
//     ("0" + date.getDate()).slice(-2) +
//     ("0" + date.getHours()).slice(-2) +
//     ("0" + date.getMinutes()).slice(-2) +
//     ("0" + date.getSeconds()).slice(-2);
// }

// export async function POST(req: Request) {
//   const { phone, amount } = await req.json();
//   const tokenRes = await fetch(`${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
//     headers: {
//       Authorization: `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_CONSUMER_KEY}:${process.env.NEXT_PUBLIC_CONSUMER_SECRET}`).toString("base64")}`,
//     },
//   });
//   const { access_token } = await tokenRes.json();

//   const timestamp = getTimestamp();
//   const password = Buffer.from(
//     process.env.NEXT_PUBLIC_MPESA_SHORTCODE! + process.env.NEXT_PUBLIC_MPESA_PASSKEY! + timestamp
//   ).toString("base64");

//   try {
//     const res = await fetch(`${process.env.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         BusinessShortCode: process.env.NEXT_PUBLIC_MPESA_SHORTCODE,
//         Password: password,
//         Timestamp: timestamp,
//         TransactionType: "CustomerPayBillOnline",
//         Amount: amount,
//         PartyA: phone,
//         PartyB: process.env.NEXT_PUBLIC_MPESA_SHORTCODE,
//         PhoneNumber: phone,
//         CallBackURL: "https://yourdomain.com/api/mpesa/callback",
//         AccountReference: "Test123",
//         TransactionDesc: "Payment",
//       }),
//     });

//     const data = await res.json();
//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json({ error: (error as Error).message }, { status: 500 });
//   }
// }
import { connect } from "@/dbConfig/dbConfig";
import transaction from "@/models/transaction";
import { NextResponse } from "next/server";

function getTimestamp() {
  const date = new Date();
  return (
    date.getFullYear().toString() +
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2)
  );
}

export async function POST(req: Request) {
  await connect()
  
  const { phone, amount } = await req.json();

  // Get access token
  const tokenRes = await fetch(
    `${process.env.MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
        ).toString("base64")}`,
      },
    }
  );

  const { access_token } = await tokenRes.json();

  const timestamp = getTimestamp();
  const password = Buffer.from(
    process.env.MPESA_SHORTCODE! + process.env.MPESA_PASSKEY! + timestamp
  ).toString("base64");
  //  const password = Buffer.from(
  //   `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY }${timestamp}`
  // ).toString("base64");

  // Add debug logging to verify your credentials
console.log('ShortCode:', process.env.MPESA_SHORTCODE);
console.log('PassKey exists:', !!process.env.MPESA_PASSKEY);
console.log('Timestamp:', timestamp);
console.log('Password length:', password.length);
// console.log('PassKey:', process.env.MPESA_PASSKEY);

  try {
    const res = await fetch(
      `${process.env.MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: process.env.MPESA_SHORTCODE,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: phone, // e.g. "2547XXXXXXXX"
          PartyB: process.env.MPESA_SHORTCODE,
          PhoneNumber: phone,
          CallBackURL: process.env.NEXT_PUBLIC_CALLBACK_URL,
          // "https://c416e099c124.ngrok-free.app", // must be public CallBackURL: "https://jamboAI.com/api/mpesa/callback"

          AccountReference: "jamboAI",
          TransactionDesc: "Subscription Payment",
        }),
      }
    );

    const data = await res.json();
    console.log("STK Response:", data);
    //save to db
   const  tx = await transaction.create({
      phone,
      amount,
      merchantRequestId: data.MerchantRequestID,
      checkoutRequestId: data.CheckoutRequestID,
      status: "PENDING",

    });
    
  console.log("Saved Transaction:", tx);
    //  return NextResponse.json(data)
    return NextResponse.json({
      checkoutRequestId: data.CheckoutRequestID,
      merchantRequestId: data.MerchantRequestID,
      // merchantRequestId: tx.MerchantRequestID,
      // checkoutRequestId: tx.CheckoutRequestID
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
//   } catch (dbErr) {
//   console.error("DB Save Error:", dbErr);
//   return NextResponse.json({ error: "DB save failed" }, { status: 500 });
// }
}

