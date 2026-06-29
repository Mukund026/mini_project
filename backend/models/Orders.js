import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },

  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },   // <-- ADD THIS
  orderedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },    // rename orderedBy to buyerId

  buyerRole: { type: String, enum: ["consumer","retailer","distributer","farmer"], required: true },
  sellerRole: { type: String, enum: ["farmer","distributer","retailer"], required: true },

  quantity: { type: Number, required: true },
  // totalPrice is INR amount (Number). If you compute it using Wei anywhere, it must remain safe.
  totalPrice: { type: Number, required: true },
  // Store Wei amounts as string to avoid JS Number overflow / BigInt/Number casting issues
  totalPriceInWei: { type: String, required: true},

  status: { type: String, enum: ["Pending","Accepted","Shipped","Delivered"], default: "Pending" },

  statusHistory: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
