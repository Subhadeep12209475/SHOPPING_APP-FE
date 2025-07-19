import { useLocation, useNavigate } from "react-router";
import { useState } from "react";

export const PlaceOrderPage = () => {
    const { state } = useLocation();
    const { grandTotal } = state || { grandTotal: 0 };

    const navigate = useNavigate();

    const [address, setAddress] = useState("");
    const [paymentMode, setPaymentMode] = useState("Cash On Delivery");
    const [fetchingLocation, setFetchingLocation] = useState(false);

    const fetchAddressFromCoordinates = async (latitude, longitude) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await response.json();
            return data.display_name || "Address not found";
        } catch {
            return "Address not found";
        }
    };

    const fetchUserLocation = () => {
        if (navigator.geolocation) {
            setFetchingLocation(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const locationAddress = await fetchAddressFromCoordinates(latitude, longitude);
                    setAddress(locationAddress);
                    setFetchingLocation(false);
                },
                () => {
                    alert("Location permission denied.");
                    setFetchingLocation(false);
                }
            );
        } else {
            alert("Geolocation not supported.");
        }
    };

    const handleOrderConfirm = () => {
        alert(`Order Placed!\nAddress: ${address}\nPayment: ${paymentMode}`);
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-200 to-indigo-200 py-10 px-4 flex justify-center items-center">
            <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl p-8 border-4 border-pink-200">

                <h2 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-indigo-600 mb-10 drop-shadow">
                    📦 Place Your Order
                </h2>

                {/* Delivery Address Section */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <label className="font-bold text-indigo-700 text-lg">
                            Delivery Address:
                        </label>
                        <button
                            onClick={fetchUserLocation}
                            disabled={fetchingLocation}
                            className={`bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-xl text-xs font-semibold shadow hover:scale-105 active:scale-95 transition ${
                                fetchingLocation ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            📍 {fetchingLocation ? "Locating..." : "Live"}
                        </button>
                    </div>

                    <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={3}
                        placeholder="Your delivery address..."
                        className="w-full bg-gradient-to-br from-white to-indigo-50 border border-purple-300 rounded-xl px-4 py-3 text-gray-800 font-medium shadow-inner focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
                    />
                </div>

                {/* Payment Method Section */}
                <div className="mb-8">
                    <label className="block font-bold text-indigo-700 text-lg mb-2">
                        Payment Method:
                    </label>
                    <select
                        value={paymentMode}
                        onChange={(e) => setPaymentMode(e.target.value)}
                        className="w-full bg-gradient-to-br from-white to-purple-100 border border-indigo-300 rounded-xl px-4 py-3 text-indigo-700 font-semibold shadow focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                    >
                        <option>Cash On Delivery</option>
                        <option>UPI</option>
                        <option>Credit Card</option>
                        <option>Net Banking</option>
                    </select>
                </div>

                {/* Total Amount */}
                <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700 mb-8 text-center drop-shadow">
                    Total: ₹{grandTotal?.toFixed(2) || "0.00"}
                </div>

                {/* Confirm Order Button */}
                <button
                    onClick={handleOrderConfirm}
                    className="w-full bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-3 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition text-lg"
                >
                    ✅ Confirm Order
                </button>

            </div>
        </div>
    );
};
