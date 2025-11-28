import express from "express";
import multer from "multer";
import { addProduct, getAllProducts, getProductsByRole, getProductsByUser, traceProduct } from "../controllers/productController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Use Multer middleware for the /add route (handle multiple images)
router.post("/add", auth, upload.array('images', 10), addProduct); // Allow up to 10 images
router.get("/all", auth, getAllProducts);
router.get("/role/:role", auth, getProductsByRole);
router.get("/byuser/:userId", auth, getProductsByUser);
router.get("/farmer/:userId", auth, getProductsByUser);
router.get("/distributer/:userId", auth, getProductsByUser);
router.get("/retailer/:userId", auth, getProductsByUser);
router.get("/trace/:productId", auth, traceProduct);

export default router;
