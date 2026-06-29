import Product from "../models/Products.js";
import Order from "../models/Orders.js";
import User from "../models/User.js";
import fs from "fs";
import path from "path";
import axios from "axios";
import Web3 from "web3";
import supplyChainContract from "../blockchain/supplyChain.js";

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      quantity,
      price, // INR amount from frontend
      description,
      listedBy,
      role,
      walletAddress
    } = req.body;

    // Initialize Web3
    const web3 = new Web3();

    // 🔁 Get live ETH price in INR
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr"
    );

    const ethInInr = response.data.ethereum.inr;

    // Convert INR → ETH → Wei
    const ethAmount = price / ethInInr;
    const priceInWei = web3.utils.toWei(ethAmount.toString(), "ether");

    // Ensure uploads folder exists
    const uploadsDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Map uploaded files to paths
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    // Build product object
    const productData = {
      name,
      category,
      quantity,
      priceInINR: price,
      priceInWei,
      description,
      listedBy,
      role,
      images
    };

    // Add wallet address based on role
    if (role === "farmer") {
      productData.farmerWallet = walletAddress;
    } else if (role === "distributer") {
      productData.distributerWallet = walletAddress;
    }

    // Save to MongoDB
    const product = await Product.create(productData);

    // Send to blockchain
    try {
      await supplyChainContract.methods.createProduct(
        product._id.toString(),
        name,
        category,
        quantity,
        priceInWei,
        "Initial",
        description
      ).send({
        from: walletAddress, // ensure this account can sign tx
        gas: 300000
      });
    } catch (blockchainError) {
      console.error("Blockchain createProduct error:", blockchainError);
      // Optionally: you can still return DB product even if blockchain fails
    }

    res.status(201).json(product);

  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("listedBy", "username email role");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductsByRole = async (req, res) => {
  try {
    const { role } = req.params;
    const products = await Product.find({ role });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProductsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const pathParts = req.path.split('/');
    const role = pathParts[1];
    const query = { listedBy: userId };
    if (role !== "byuser") query.role = role;
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ TRACE PRODUCT
export const traceProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId).populate("listedBy", "username role");
    if (!product) return res.status(404).json({ message: "Product not found" });

    const orders = await Order.find({ product: productId })
      .populate("orderedBy", "username role")
      .sort({ createdAt: 1 });

    const supplyChain = [];

    // Producer
    supplyChain.push({
      role: product.role.charAt(0).toUpperCase() + product.role.slice(1),
      name: product.listedBy.username,
      date: product.createdAt.toLocaleDateString(),
      transactionId: `PROD-${product._id.toString().slice(-6)}`,
      userId: product.listedBy._id
    });

    // Orders
    orders.forEach(order => {
      supplyChain.push({
        role: order.orderedByRole.charAt(0).toUpperCase() + order.orderedByRole.slice(1),
        name: order.orderedBy.username,
        date: new Date(order.createdAt).toLocaleDateString(),
        transactionId: `ORD-${order._id.toString().slice(-6)}`,
        userId: order.orderedBy._id,
        quantity: order.quantity,
        totalPrice: order.totalPrice,
        status: order.status
      });
    });

    // Blockchain traces
    let blockchainTraces = [];
    try {
      blockchainTraces = await supplyChainContract.methods.getAllTraces(productId.toString()).call();
    } catch (blockchainError) {
      console.error("Blockchain getAllTraces error:", blockchainError);
    }

    res.json({
      productId: product._id,
      productName: product.name,
      supplyChain,
      blockchainTraces
    });

  } catch (err) {
    console.error("Error tracing product:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getWalletAddresses = async (req, res) => {
  try {
    res.json({ walletAddresses: [] }); // implement logic later if needed
  } catch (err) {
    console.error("Error fetching wallet addresses:", err);
    res.status(500).json({ message: err.message });
  }
};