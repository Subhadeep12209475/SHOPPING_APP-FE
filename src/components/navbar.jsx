import { Link, useNavigate, } from "react-router";
import { useState } from "react";
import { useAppContext } from "../contexts/appContext";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast, SuccessToast } from "../utils/toastHelper";

const Navbar = () => {
    const { user = {}, cartItems = [] } = useAppContext();
    const navigate = useNavigate();
    //const location = useLocation();
    const { isAuthenticated } = user;
    const [searchText, setSearchText] = useState("");

    const handleLogout = async () => {
        try {
            await axiosInstance.get("/auth/logout");
            SuccessToast("Logout successful!");
            window.location.reload();
        } catch (err) {
            ErrorToast(err.message);
        }
    };

    const handleSearch = () => {
        if (searchText.trim()) {
            navigate(`/?query=${encodeURIComponent(searchText.trim())}`);
            setSearchText("");
        }
    };

    const handleOpenProfilePage = () => navigate("/profile");
    const handleOpenCartPage = () => navigate("/cart");

    return (
        <div className="p-4 bg-gradient-to-r from-indigo-800 via-indigo-900 to-purple-900 shadow-md sticky top-0 z-50">
            <div className="flex justify-between items-center max-w-7xl mx-auto">

                {/* Logo */}
                <Link
                    to="/"
                    className="text-3xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-lg hover:scale-105 transform transition"
                >
                    🛍️ Subify
                </Link>

                {/* Search Bar */}
                <div className="hidden md:flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm mx-4">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="bg-transparent outline-none text-gray-700 w-40 lg:w-64"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-1.5 rounded-full transition"
                    >
                        🔍
                    </button>
                </div>

                {/* Navigation / Auth Section */}
                <div className="flex items-center gap-4">
                    <Link
                        to="/"
                        className="bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold px-4 py-2 rounded-full shadow hover:from-green-500 hover:to-green-700 transition"
                    >
                        🏠 Home
                    </Link>

                    {isAuthenticated && (
                        <button
                            onClick={handleOpenCartPage}
                            className="relative bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-4 py-2 rounded-full font-semibold shadow transition"
                        >
                            🛒 Cart
                            {cartItems.length > 0 && (
                                <span className="absolute top-[-8px] right-[-8px] bg-yellow-400 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold text-black border-2 border-white">
                                    {cartItems.length}
                                </span>
                            )}
                        </button>
                    )}

                    {!isAuthenticated ? (
                        <>
                            <Link
                                to="/login"
                                className="text-indigo-300 font-semibold hover:underline hover:text-yellow-400 transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-indigo-600 hover:bg-indigo-800 text-white px-4 py-2 rounded-full font-semibold shadow transition"
                            >
                                Signup
                            </Link>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-full font-semibold shadow transition"
                            >
                                Logout
                            </button>
                            <div
                                onClick={handleOpenProfilePage}
                                className="h-10 w-10 rounded-full bg-indigo-600 hover:bg-indigo-800 text-white font-bold flex items-center justify-center cursor-pointer transition"
                                title="Profile"
                            >
                                {user?.email?.substr(0, 1)?.toUpperCase()}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export { Navbar };
