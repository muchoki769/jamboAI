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
  // const result = body.Body.stkCallback; 
   const result = body?.Body?.stkCallback;
  if (!result) {
    return NextResponse.json({ message: "Invalid callback format" }, { status: 400 });
  }
  const checkoutRequestId = result.CheckoutRequestID;

  const status = result.ResultCode === 0 ? "SUCCESS" : "FAILED";

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
