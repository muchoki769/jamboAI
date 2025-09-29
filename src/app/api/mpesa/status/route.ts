// import { connect } from "@/dbConfig/dbConfig";
// import transaction from "@/models/transaction";
// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//     await connect();
//      const { searchParams } = new URL(req.url);
//     const checkoutRequestId = searchParams.get("checkoutRequestId");

//      if (!checkoutRequestId) {
//     return NextResponse.json({ message: "Missing checkoutRequestId" }, { status: 400 });
//    }

//    const txn = await transaction.findOne({ checkoutRequestId });
//     if (!txn) {
//     return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
//   }
//    return NextResponse.json({ status: txn.status });
// }
// /api/mpesa/status.ts
import { connect } from "@/dbConfig/dbConfig";
import transaction from "@/models/transaction";
import { NextResponse } from "next/server";

 connect();

export  async function GET(req: Request) {

  try { 
   
    const { searchParams } = new URL(req.url);
    const checkoutRequestId = searchParams.get("checkoutRequestId");

     if (!checkoutRequestId) {
    return NextResponse.json({ message: "Missing checkoutRequestId" }, { status: 400 });
   }
    // const { checkoutRequestId } = req.query;

    const tx = await transaction.findOne({ checkoutRequestId });

   if (tx.status === "PENDING") {
      return NextResponse.json({ status: "PENDING" });
    }

    if (tx.status === "PENDING") {
      return NextResponse.json({ status: "PENDING" });
    }

    if (tx.status === "SUCCESS") {
      return NextResponse.json({ status: "SUCCESS" });
    }

    return NextResponse.json({ status: tx.status });
  } catch (err) {
    // return NextResponse.status(500).json({ status: "ERROR" });
    console.error("Error fetching mpesa status:", err);
     return NextResponse.json({ status: "ERROR" }, {status: 500});
  }
}
