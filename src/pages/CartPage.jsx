import { useEffect, useState } from "react";
import axios from "axios";

export const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCartItems = async () => {
        setLoading(true);
        try {
            const res = await axios.get("https://shopping-app-be-px0z.onrender.com/api/v1/cart/item", {
                withCredentials: true
            });
            setCartItems(res.data.items || []);
        } catch (error) {
            console.error("Error fetching cart items", error);
        }
        setLoading(false);
    };

    const handleRemoveFromCart = async (productId) => {
        try {
            await axios.delete(`https://shopping-app-be-px0z.onrender.com/api/v1/cart/remove/${productId}`, {
                withCredentials: true
            });
            fetchCartItems();
        } catch (error) {
            console.error("Error removing item", error);
        }
    };

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

    useEffect(() => {
        fetchCartItems();
    }, []);

    return (
        <div className="min-h-screen bg-blue-100 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
                    Your Cart 🛒
                </h2>

                {loading ? (
                    <p className="text-center text-gray-500 text-lg">Loading...</p>
                ) : cartItems.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">
                        Your cart is empty. 🛍️
                    </p>
                ) : (
                    <div className="space-y-6">
                        {cartItems.map((item) => (
                            <div
                                key={item._id}
                                className="flex items-center bg-indigo-50 rounded-lg shadow p-4 hover:bg-indigo-100 transition"
                            >
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="w-24 h-24 object-cover rounded-lg mr-4"
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-indigo-800 truncate">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-700 font-semibold">
                                        ₹{item.price}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleRemoveFromCart(item.productId)}
                                    className="bg-red-500 hover:bg-red-700 text-white px-4 py-1 rounded-lg font-semibold transition"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        <div className="text-right mt-8 border-t pt-4">
                            <p className="text-xl font-bold text-indigo-900">
                                Total Amount: ₹{totalAmount.toFixed(2)}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
