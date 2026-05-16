import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Load Product
    const loadProduct = useCallback(async () => {

        try {

            setLoading(true);
            setError("");

            const res = await api.get(`/products/${id}`);

            setProduct(res.data);

        } catch (err) {

            console.error("Product fetch error:", err);

            setError("Failed to load product");

        } finally {

            setLoading(false);
        }

    }, [id]);

    useEffect(() => {

        if (id) {
            loadProduct();
        }

    }, [id, loadProduct]);

    // Add To Cart
    const addToCart = async () => {

        try {

            const userId = localStorage.getItem("userId");

            if (!userId) {

                alert("Please login first");
                navigate("/login");

                return;
            }

            if (!product?._id) {
                return;
            }

            const res = await api.post("/cart/add", {
                userId,
                productId: product._id,
            });

            // Safe cart calculation
            const items = res?.data?.cart?.items || [];

            const total = items.reduce(
                (sum, item) => sum + (item.quantity || 0),
                0
            );

            // Save latest cart count
            localStorage.setItem("cartCount", total);

            // Update navbar instantly
            window.dispatchEvent(new Event("cartUpdated"));

            alert("Product added to cart!");

        } catch (err) {

            console.error("Add to cart error:", err);

            alert(
                err?.response?.data?.message ||
                "Failed to add product to cart"
            );
        }
    };

    // Loading UI
    if (loading) {

        return (
            <div className="flex justify-center items-center h-[60vh] text-xl font-semibold">
                Loading...
            </div>
        );
    }

    // Error UI
    if (error) {

        return (
            <div className="flex justify-center items-center h-[60vh] text-red-600 text-xl font-semibold">
                {error}
            </div>
        );
    }

    // Product Not Found
    if (!product) {

        return (
            <div className="flex justify-center items-center h-[60vh] text-xl font-semibold">
                Product not found
            </div>
        );
    }

    return (

        <div className="max-w-6xl mx-auto p-6">

            <div className="grid md:grid-cols-2 gap-10 bg-white shadow-lg rounded-2xl p-6">

                {/* Product Image */}
                <div className="flex justify-center items-center bg-gray-100 rounded-xl p-6">

                    <img
                        src={product.image}
                        alt={product.title}
                        className="h-80 object-contain"
                    />

                </div>

                {/* Product Details */}
                <div className="flex flex-col justify-center">

                    <h1 className="text-3xl font-bold text-gray-800">
                        {product.title}
                    </h1>

                    <p className="text-gray-600 mt-4 leading-7">
                        {product.description}
                    </p>

                    <p className="text-3xl font-bold text-blue-600 mt-6">
                        ${product.price}
                    </p>

                    <button
                        onClick={addToCart}
                        className="mt-8 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold transition"
                    >
                        Add To Cart
                    </button>

                </div>

            </div>

        </div>
    );
}