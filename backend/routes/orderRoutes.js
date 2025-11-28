import express from "express";
import { createOrder, getOrdersForUser, getOrdersForSeller, confirmOrder, shipOrder, deliverOrder, cancelOrder, getOrderById } from "../controllers/orderControllers.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/create", auth, createOrder);
router.get("/user/:userId", auth, getOrdersForUser);
router.get("/seller/:userId", auth, getOrdersForSeller);
router.put("/confirm/:orderId", auth, confirmOrder);
router.put("/ship/:orderId", auth, shipOrder);
router.put("/deliver/:orderId", auth, deliverOrder);
router.put("/cancel/:orderId", auth, cancelOrder);
router.get("/:orderId", auth, getOrderById);

export default router;
