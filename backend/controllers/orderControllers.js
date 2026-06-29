import mongoose from "mongoose";
import Order from "../models/Orders.js";
import Product from "../models/Products.js"; // ✅ fixed import name
import { io } from "../index.js";
import supplyChainContract from "../blockchain/supplyChain.js";

// ✅ CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    console.log("Incoming Order:", req.body);

    const { productId, orderedBy, orderedByRole, quantity } = req.body;

    // Verify the user from token matches the orderedBy
    if (req.user.id?.toString() !== orderedBy?.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }


    // Check if an order for this product by this user already exists
    const existingOrder = await Order.findOne({ product: productId, orderedBy });

    if (existingOrder) {
      return res.status(400).json({ message: "Order for this product already exists" });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // IMPORTANT: Avoid any chance of putting Wei/bigint-like values into Order.totalPrice (Number).
    // Use priceInINR as-is, but if it isn't a finite number, derive totalPrice using priceInWei only for wei field.
    // (Return 400 if priceInINR is invalid so we don't create inconsistent orders.)
    console.log("Product priceInINR:", product.priceInINR, "type:", typeof product.priceInINR);

    const priceInINR = Number(product.priceInINR);
    if (!Number.isFinite(priceInINR)) {
      return res.status(400).json({ message: "Invalid product.priceInINR (must be a finite number)" });
    }
    const totalPrice = quantity * priceInINR;

    // Wei values must be stored as string (not Number)
    const totalPriceInWei = (BigInt(product.priceInWei) * BigInt(quantity)).toString();


    const order = await Order.create({
      product: productId,
      sellerId: product.listedBy,
      orderedBy,
      buyerRole: orderedByRole,
      sellerRole: product.role,
      quantity,
      totalPrice,
      totalPriceInWei,
    });


    // Add initial status to history
    order.statusHistory.push({ status: "Pending", timestamp: new Date() });
    await order.save();

    console.log("Order Created:", order);

    // Emit new order event to the seller's room
    io.to(product.listedBy.toString()).emit('newOrder', {
      message: 'New order received',
      order: {
        id: order._id,
        product: product.name,
        buyer: req.user.username || 'Unknown',
        quantity,
        totalPrice
      }
    });

    // Emit order placed event to the buyer's room
    io.to(orderedBy).emit('orderPlaced', {
      message: 'Order placed successfully',
      order: {
        id: order._id,
        product: product.name,
        quantity,
        totalPrice
      }
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ORDERS PLACED BY A USER (CONSUMER SIDE)
export const getOrdersForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify that the authenticated user is the same as the requested userId
    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Unauthorized to view these orders" });
    }

    const orders = await Order.find({ orderedBy: userId, buyerRole: req.user.role })
      .populate("product", "name category priceInINR priceInWei listedBy")
      .populate("orderedBy", "username role");

    res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: err.message });
  }
};

export const getOrdersForSeller = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;

    // Ensure indexes on Order.product, Order.orderedBy, Order.orderedByRole, Product.listedBy, User._id for better performance
    // Use aggregation for better performance: join orders with products and filter
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $match: {
          'product.listedBy': new mongoose.Types.ObjectId(userId),
          orderedBy: { $ne: new mongoose.Types.ObjectId(userId) }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'orderedBy',
          foreignField: '_id',
          as: 'orderedBy'
        }
      },
      {
        $unwind: '$orderedBy'
      },
      {
        $project: {
          _id: 1,
          product: {
            _id: '$product._id',
            name: '$product.name',
            priceInINR: '$product.priceInINR',
            priceInWei: '$product.priceInWei',
            listedBy: '$product.listedBy'
          },
          orderedBy: {
            _id: '$orderedBy._id',
            name: '$orderedBy.name',
            email: '$orderedBy.email'
          },
          orderedByRole: 1,
          quantity: 1,
          totalPrice: 1,
          status: 1,
          createdAt: 1,
          statusHistory: 1
        }
      },
      {
        $group: {
          _id: '$_id',
          product: { $first: '$product' },
          orderedBy: { $first: '$orderedBy' },
          orderedByRole: { $first: '$orderedByRole' },
          quantity: { $first: '$quantity' },
          totalPrice: { $first: '$totalPrice' },
          status: { $first: '$status' },
          createdAt: { $first: '$createdAt' },
          statusHistory: { $first: '$statusHistory' }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $skip: (page - 1) * limit
      },
      {
        $limit: limit
      }
    ]);

    res.json({ orders, page, limit });
  } catch (err) {
    console.error("Error fetching seller orders:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ CONFIRM ORDER (Update status to Accepted)
export const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order
    const order = await Order.findById(orderId).populate("product", "listedBy");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify that the authenticated user is the seller of the product
    if (order.product.listedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to confirm this order" });
    }

    // Update order status to Accepted
    order.status = "Accepted";
    order.statusHistory.push({ status: "Accepted", timestamp: new Date() });
    await order.save();

    console.log("Order confirmed:", order._id);

    // Add trace to blockchain for order confirmation
    try {
      const productId = order.product._id.toString();
      await supplyChainContract.methods.addTrace(
        productId,
        order.quantity,
        // Avoid JS Number division overflow; use Wei per-unit string arithmetic on-chain units
        (BigInt(order.totalPriceInWei) / BigInt(order.quantity)).toString(), // pricePerUnit (wei)
        "Confirmed", // quality
        `Order confirmed by ${req.user.username}` // metaUri
      ).send({ from: req.user.id, gas: 300000 });
    } catch (blockchainError) {
      console.error("Blockchain addTrace error:", blockchainError);
    }

    // Emit order confirmation event to the buyer and seller
    io.to(order.orderedBy.toString()).emit('orderConfirmed', {
      message: 'Your order has been confirmed',
      order: {
        id: order._id,
        product: order.product.name,
        status: order.status
      }
    });
    io.to(order.product.listedBy.toString()).emit('orderStatusUpdated', {
      orderId: order._id,
      status: order.status
    });

    res.json({ message: "Order confirmed successfully", order });
  } catch (err) {
    console.error("Error confirming order:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ SHIP ORDER (Update status to Shipped)
export const shipOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order
    const order = await Order.findById(orderId).populate("product", "listedBy");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify that the authenticated user is the seller of the product
    if (order.product.listedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to ship this order" });
    }

    // Update order status to Shipped
    order.status = "Shipped";
    order.statusHistory.push({ status: "Shipped", timestamp: new Date() });
    await order.save();

    console.log("Order shipped:", order._id);

    // Transfer ownership on blockchain
    try {
      const productId = order.product._id.toString();
      await supplyChainContract.methods.transferOwnership(
        productId,
        order.orderedBy.toString(), // newOwner
        order.quantity,
        // Avoid JS Number division overflow; use Wei per-unit string arithmetic on-chain units
        (BigInt(order.totalPriceInWei) / BigInt(order.quantity)).toString(), // pricePerUnit (wei)
        "Shipped", // quality
        `Ownership transferred to ${order.orderedBy}` // metaUri
      ).send({ from: req.user.id, gas: 300000 });
    } catch (blockchainError) {
      console.error("Blockchain transferOwnership error:", blockchainError);
    }

    // Emit order shipped event to the buyer and seller
    io.to(order.orderedBy.toString()).emit('orderShipped', {
      message: 'Your order has been shipped',
      order: {
        id: order._id,
        product: order.product.name,
        status: order.status
      }
    });
    io.to(order.product.listedBy.toString()).emit('orderStatusUpdated', {
      orderId: order._id,
      status: order.status
    });

    res.json({ message: "Order shipped successfully", order });
  } catch (err) {
    console.error("Error shipping order:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELIVER ORDER (Update status to Delivered)
export const deliverOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order
    const order = await Order.findById(orderId).populate("product", "listedBy");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify that the authenticated user is the seller of the product
    if (order.product.listedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to deliver this order" });
    }

    // Update order status to Delivered
    order.status = "Delivered";
    order.statusHistory.push({ status: "Delivered", timestamp: new Date() });
    await order.save();

    console.log("Order delivered:", order._id);

    // Emit order delivered event to the buyer
    io.to(order.orderedBy.toString()).emit('orderDelivered', {
      message: 'Your order has been delivered',
      order: {
        id: order._id,
        product: order.product.name,
        status: order.status
      }
    });

    res.json({ message: "Order delivered successfully", order });
  } catch (err) {
    console.error("Error delivering order:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ CANCEL ORDER (Update status to Cancelled)
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order
    const order = await Order.findById(orderId).populate("product", "listedBy");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify that the authenticated user is the seller of the product
    if (order.product.listedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to cancel this order" });
    }

    // Update order status to Cancelled
    order.status = "Cancelled";
    order.statusHistory.push({ status: "Cancelled", timestamp: new Date() });
    await order.save();

    console.log("Order cancelled:", order._id);

    // Emit order cancelled event to the buyer and seller
    io.to(order.orderedBy.toString()).emit('orderCancelled', {
      message: 'Your order has been cancelled',
      order: {
        id: order._id,
        product: order.product.name,
        status: order.status
      }
    });
    io.to(order.product.listedBy.toString()).emit('orderStatusUpdated', {
      orderId: order._id,
      status: order.status
    });

    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    console.error("Error cancelling order:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET SINGLE ORDER BY ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("product", "name priceInINR priceInWei listedBy")
      .populate("orderedBy", "username role");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the user is authorized to view this order
    // Allow both the buyer (orderedBy) and the seller (product.listedBy) to view the order
    const isBuyer = order.orderedBy._id.toString() === req.user.id;
    const isSeller = order.product && order.product.listedBy.toString() === req.user.id;

    if (!isBuyer && !isSeller) {
      return res.status(403).json({ message: "Unauthorized to view this order" });
    }

    res.json(order);
  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ message: err.message });
  }
};
