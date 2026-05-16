import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";

export default function Navbar() {

    const navigate = useNavigate();

    const [cartCount, setCartCount] = useState(0);

    const userId = localStorage.getItem("userId");

    // Load cart count
    const loadCart = useCallback(async () => {

        try {

            if (!userId) {
                setCartCount(0);
                return;
            }

            const res = await api.get(`/cart/${userId}`);

            // Safe check
            const items = res?.data?.items || [];

            const total = items.reduce(
                (sum, item) => sum + (item.quantity || 0),
                0
            );

            setCartCount(total);

        } catch (error) {

            console.error("Cart load error:", error);

            // Prevent crash
            setCartCount(0);
        }

    }, [userId]);

    useEffect(() => {

        loadCart();

        // Listen cart updates
        window.addEventListener("cartUpdated", loadCart);

        return () => {
            window.removeEventListener("cartUpdated", loadCart);
        };

    }, [loadCart]);

    // Logout function
    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("userId");

        setCartCount(0);

        navigate("/login");
    };

    return (
        <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-black text-white">

            {/* Logo */}
            <Link
                to="/"
                className="font-bold text-2xl hover:text-gray-300 transition"
            >
                ABHI mart
            </Link>

            {/* Right Side */}
            <div className="flex items-center gap-6">

                {/* Cart */}
                <Link
                    to="/cart"
                    className="relative text-2xl"
                >
                    🛒

                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full px-1">
                            {cartCount}
                        </span>
                    )}
                </Link>

                {/* Auth Buttons */}
                {!userId ? (
                    <>
                        <Link
                            to="/login"
                            className="text-lg hover:text-gray-300 transition"
                        >
                            Login
                        </Link>

                        <Link
                            to="/signup"
                            className="text-lg hover:text-gray-300 transition"
                        >
                            Signup
                        </Link>
                    </>
                ) : (
                    <button
                        onClick={logout}
                        className="text-lg bg-red-600 px-4 py-1 rounded hover:bg-red-700 transition"
                    >
                        Logout
                    </button>
                )}

            </div>
        </nav>
    );
}