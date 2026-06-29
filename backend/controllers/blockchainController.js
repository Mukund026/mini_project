// backend/controllers/blockchainController.js
import contract from "../blockchain/supplyChain.js";
import QRCode from "qrcode";
import Product from "../models/Products.js";
import crypto from "crypto";

export const createProductOnChain = async (req, res) => {
  try {
    const { name, category, quantity, price, quality, metaUri, listedBy } = req.body;

    const productId = crypto.randomBytes(16).toString("hex");
    const productHash = ethers.id(productId);

    const tx = await contract.createProduct(
      productHash,
      name,
      category,
      quantity,
      price,
      quality,
      metaUri
    );

    await tx.wait();

    // Generate QR link
    const qrUrl = `https://yourdomain.com/trace/${productHash}`;
    const qrImage = await QRCode.toDataURL(qrUrl);

    const dbEntry = await Product.create({
      name,
      category,
      quantity,
      price,
      description: quality,
      listedBy,
      role: "farmer",
      images: [],
      blockchainProductId: productHash,
      qrCode: qrImage,
    });

    res.json({
      success: true,
      productHash,
      qrImage,
      dbEntry,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const transferProduct = async (req, res) => {
  try {
    const { productHash, newOwner, quantity, price, quality, metaUri } = req.body;

    const tx = await contract.transferOwnership(
      productHash,
      newOwner,
      quantity,
      price,
      quality,
      metaUri
    );

    await tx.wait();

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getTraceHistory = async (req, res) => {
  try {
    const { productHash } = req.params;

    const traces = await contract.getAllTraces(productHash);

    res.json({ traces });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
