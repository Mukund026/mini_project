import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  priceInINR: { type: Number, required: true },
  priceInWei: { type: String, required: true},  // ✅ Added priceInWei
  description: { type: String },
  listedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["farmer", "distributer", "retailer"], required: true },
  farmerWallet: { type: String },
  distributerWallet: { type: String },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Product", productSchema);