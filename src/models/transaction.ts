import mongoose, { Schema } from "mongoose";

const TransactionSchema = new Schema (
    {
        phone: String,
        amount: Number,
        merchantRequestId: String,
        checkoutRequestId: String,
        resultCode: String,
        resultDesc: String,
        mpesaReceiptNumber: String,
        status: { type: String, default: "PENDING" },
    },
    { timestamps: true }
)
export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);