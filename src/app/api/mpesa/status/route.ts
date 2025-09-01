import { connect } from "@/dbConfig/dbConfig";
import transaction from "@/models/transaction";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    await connect();
     const { searchParams } = new URL(req.url);
    const checkoutRequestId = searchParams.get("checkoutRequestId");

     if (!checkoutRequestId) {
    return NextResponse.json({ message: "Missing checkoutRequestId" }, { status: 400 });
   }

   const txn = await transaction.findOne({ checkoutRequestId });
    if (!txn) {
    return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
  }
   return NextResponse.json({ status: txn.status });
}