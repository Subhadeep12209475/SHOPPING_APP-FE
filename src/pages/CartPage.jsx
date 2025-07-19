import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
export const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCartItems = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${BASE_URL}/cart/item`, {
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
        await axios.delete(`${BASE_URL}/cart/remove/${productId}`, {
            withCredentials: true
        });
        fetchCartItems();
    } catch (error) {
        console.error("Error removing item", error);
    }
};

    const clearEntireCart = async () => {
        try {
            for (const item of cartItems) {
                await axios.delete(`${BASE_URL}/cart/remove/${item.productId}`, {
                    withCredentials: true
                });
            }
            setCartItems([]); // clear client-side state as well
        } catch (error) {
            console.error("Failed to clear cart after placing order:", error);
        }
    };

    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
    const tax = totalAmount * 0.02;
    const shippingFee = 0;
    const grandTotal = totalAmount + tax + shippingFee;

    const handlePlaceOrder = async () => {
        navigate("/place-order", {
            state: {
                totalAmount,
                tax,
                shippingFee,
                grandTotal
            }
        });

        // Clear cart after navigating
        await clearEntireCart();
    };

    useEffect(() => {
        fetchCartItems();
    }, []);

    return (
        <div className="min-h-screen bg-indigo-100 py-10 px-4">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-8">
                <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
                    Your Cart 🛒
                </h2>

                {loading ? (
                    <p className="text-center text-gray-500 text-lg">Loading...</p>
                ) : cartItems.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">
                        Your cart is empty.
                    </p>
                ) : (
                    <>
                        <div className="space-y-6 mb-10">
                            {cartItems.map((item) => (
                                <div key={item._id} className="flex items-center bg-indigo-50 rounded-xl shadow p-4">
                                    <img src={item.thumbnail} alt={item.title} className="w-24 h-24 object-cover rounded-xl mr-4" />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-indigo-800">{item.title}</h3>
                                        <p className="text-indigo-600 font-semibold">₹{item.price}</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveFromCart(item.productId)}
                                        className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="bg-indigo-50 rounded-xl shadow p-6 mb-8">
                            <p className="text-lg font-semibold text-gray-700 mb-2">
                                Subtotal: ₹{totalAmount.toFixed(2)}
                            </p>
                            <p className="text-lg font-semibold text-gray-700 mb-2">
                                Tax (2%): ₹{tax.toFixed(2)}
                            </p>
                            <p className="text-lg font-semibold text-gray-700 mb-2">
                                Shipping Fee: Free
                            </p>
                            <p className="text-2xl font-bold text-indigo-700 mt-4">
                                Grand Total: ₹{grandTotal.toFixed(2)}
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={handlePlaceOrder}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-xl text-lg shadow transition"
                            >
                                📦 Place Order
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
