import Product from "../models/product.js";


// Get all products
export const getProducts = async (req, res) => {

    try {

        const products = await Product.find();

        res.status(200).json(products);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch products"
        });
    }
};


// Get single product
export const getSingleProduct = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Create product
export const createProduct = async (req, res) => {

    try {

        const product = new Product(req.body);

        await product.save();

        res.status(201).json(product);

    } catch (error) {

        res.status(500).json({
            message: "Failed to create product"
        });
    }
};


// Update product
export const updateProduct = async (req, res) => {

    try {

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedProduct);

    } catch (error) {

        res.status(500).json({
            message: "Failed to update product"
        });
    }
};


// Delete product
export const deleteProduct = async (req, res) => {

    try {

        await Product.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Product deleted"
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to delete product"
        });
    }
};