import express from "express";
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getSingleProduct
} from "../controllers/productController.js";

const router = express.Router();

// Get all products
router.get("/", getProducts);

// Get single product
router.get("/:id", getSingleProduct);

// Create product
router.post("/add", createProduct);

// Update product
router.put("/update/:id", updateProduct);

// Delete product
router.delete("/delete/:id", deleteProduct);

export default router;