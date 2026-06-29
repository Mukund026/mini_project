// backend/routes/blockchainRoutes.js
import express from "express";
import {
  createProductOnChain,
  transferProduct,
  getTraceHistory,
} from "../controllers/blockchainController.js";

const router = express.Router();

router.post("/create", createProductOnChain);
router.post("/transfer", transferProduct);
router.get("/trace/:productHash", getTraceHistory);

export default router;
