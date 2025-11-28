import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  listedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, enum: ["farmer", "distributer", "retailer"], required: true },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Product", productSchema);