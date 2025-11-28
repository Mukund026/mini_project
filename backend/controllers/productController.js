import Product from "../models/Products.js";
import Order from "../models/Orders.js";
import User from "../models/User.js";
import fs from "fs";
import path from "path";

export const addProduct = async (req, res) => {
  try {
    const { name, category, quantity, price, description, listedBy, role } = req.body;

    // Ensure uploads directory exists
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Get image paths from uploaded files
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const product = await Product.create({ name, category, quantity, price, description, listedBy, role, images });
    res.status(201).json(product);
  } catch (err) {
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
    if (role !== "byuser") {
      query.role = role;
    }
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

    // Find the product
    const product = await Product.findById(productId).populate("listedBy", "username role");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find all orders for this product
    const orders = await Order.find({ product: productId })
      .populate("orderedBy", "username role")
      .sort({ createdAt: 1 });

    // Build the supply chain
    const supplyChain = [];

    // Add the producer (farmer/distributor/retailer who listed the product)
    supplyChain.push({
      role: product.role.charAt(0).toUpperCase() + product.role.slice(1),
      name: product.listedBy.username,
      date: product.createdAt.toLocaleDateString(),
      transactionId: `PROD-${product._id.toString().slice(-6)}`,
      userId: product.listedBy._id
    });

    // Add each transaction in the chain
    orders.forEach((order, index) => {
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

    res.json({
      productId: product._id,
      productName: product.name,
      supplyChain
    });
  } catch (err) {
    console.error("Error tracing product:", err);
    res.status(500).json({ message: err.message });
  }
};
