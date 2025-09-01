import { connect } from "@/dbConfig/dbConfig";
import transaction from "@/models/transaction";
import { NextResponse } from "next/server";

export async function POST (req: Request) {
    await connect();
    const {checkoutRequestId} = await req.json();

    const tx = await transaction.findOne({checkoutRequestId});
    if(!tx) return  NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(tx);
}