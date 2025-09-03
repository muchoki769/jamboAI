import { connect } from "@/dbConfig/dbConfig";
import transaction from "@/models/transaction";
import { NextResponse } from "next/server";

type CallbackItem = {
  Name: string;
  Value: string | number | null;
};
export async function POST(req: Request) {
  await connect();
  const body = await req.json();
  console.log("M-Pesa Callback: ", body);

 

  // Save to DB (success/failure)
  const result = body.Body.stkCallback; 
  //  const result = body?.Body?.stkCallback.ResultCode;
  //  const checkoutRequestId = body?.Body?.stkCallback.CheckoutRequestID;
  if (!result) {
    return NextResponse.json({ message: "Invalid callback format" }, { status: 400 });
  }
  const checkoutRequestId = result.CheckoutRequestID;

  const status = result.resultCode === 0 ? "SUCCESS" : "FAILED";

  await transaction.findOneAndUpdate(
    {checkoutRequestId},
    {
      resultCode: result.ResultCode,
      resultDesc: result.ResultDesc,
      mpesaReceiptNumber: result.CallbackMetadata?.Item?.find(
        (i: CallbackItem) => i.Name === "MpesaReceiptNumber"
      )?.Value,
      status,
    },
    {new: true}
  )
  return NextResponse.json({ message: "Callback received" });
}

// const result = body?.Body?.stkCallback;
// if (!result) {
//   return NextResponse.json(
//     { message: "Invalid callback format" },
//     { status: 400 }
//   );
// }

// const checkoutRequestId = result.CheckoutRequestID;
// const status = result.ResultCode === 0 ? "SUCCESS" : "FAILED";

// // Build update object
// const update: any = {
//   resultCode: result.ResultCode,
//   resultDesc: result.ResultDesc,
//   mpesaReceiptNumber: result.CallbackMetadata?.Item?.find(
//     (i: CallbackItem) => i.Name === "MpesaReceiptNumber"
//   )?.Value,
//   status,
// };

// // Extend subscription if success
// if (result.ResultCode === 0) {
//   const tx = await Transaction.findOne({ checkoutRequestId });
//   if (tx) {
//     const now = new Date();
//     if (tx.validUntil && tx.validUntil > now) {
//       tx.validUntil.setMonth(tx.validUntil.getMonth() + 1);
//     } else {
//       now.setMonth(now.getMonth() + 1);
//       tx.validUntil = now;
//     }
//     update.validUntil = tx.validUntil;
//   }
// }

// await Transaction.findOneAndUpdate({ checkoutRequestId }, update, { new: true });

// return NextResponse.json({ message: "Callback received" });

