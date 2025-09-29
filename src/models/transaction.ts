import mongoose, { Schema } from "mongoose";

const TransactionSchema = new Schema (
    {  
         userId: { 
         type: mongoose.Schema.Types.ObjectId,
         ref: "users", 
         required: true
     },
        phone: String,
        amount: Number,
        merchantRequestId: String,
        checkoutRequestId: String,
        resultCode: String,
        resultDesc: String,
        mpesaReceiptNumber: String,
        status: { type: String, default: "PENDING" },

        subscriptionType: {
            type: String,
            enum: ["basic", "pro", "enterprise"],
            required: true,
            },
            validUntil: {
            type: Date,
            required: true,
            default: () => {
                const now = new Date();
                now.setMonth(now.getMonth() + 1); // add 1 month
                return now;
      },
    },
},
    { timestamps: true }
);

TransactionSchema.pre("save", function (next) {
    if (this.amount === 100) {
        this.subscriptionType = "basic";
          this.validUntil = new Date(new Date().setMonth(new Date().getMonth() + 1));

    } else if (this.amount === 500) {
        this.subscriptionType = "pro";
          this.validUntil = new Date(new Date().setMonth(new Date().getMonth() + 1));
    } else if (this.amount === 1000) {
        this.subscriptionType = "enterprise";
          this.validUntil = new Date(new Date().setMonth(new Date().getMonth() + 1));
    }
    next();
})
export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);