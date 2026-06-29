import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { name, email, password, userType, walletAddress } = req.body;

    if (!name || !email || !password || !userType || !walletAddress) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const validUserTypes = ['farmer', 'distributer', 'retailer', 'consumer'];
    if (!validUserTypes.includes(userType)) {
      return res.status(400).json({ message: "Invalid user type" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const existingWallet = await User.findOne({ walletAddress });
    if (existingWallet) return res.status(400).json({ message: "Wallet address already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, userType, walletAddress });
    await user.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password, userType } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.userType !== userType) return res.status(400).json({ message: "Invalid user type" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, role: user.userType },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🧩 Generate formatted ID message
    const rolePrefix = {
      farmer: "Farmer ID",
      distributer: "Distributor ID",
      retailer: "Retailer ID",
      consumer: "Consumer ID"
    };

    const message = `Your ${rolePrefix[user.userType]} is ${user._id}`;

    res.json({
      message,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.userType,
        walletAddress: user.walletAddress,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
