import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },

  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },   // <-- ADD THIS
  orderedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },    // rename orderedBy to buyerId

  buyerRole: { type: String, enum: ["consumer","retailer","distributer","farmer"], required: true },
  sellerRole: { type: String, enum: ["farmer","distributer","retailer"], required: true },

  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },

  status: { type: String, enum: ["Pending","Accepted","Shipped","Delivered"], default: "Pending" },

  statusHistory: [{
    status: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
  }],

  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Order", orderSchema);
