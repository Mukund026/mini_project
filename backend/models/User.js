import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true, enum: ['farmer', 'distributer', 'retailer', 'consumer'] },
  walletAddress: { type: String, unique: true },
});

export default mongoose.model("User", userSchema);
