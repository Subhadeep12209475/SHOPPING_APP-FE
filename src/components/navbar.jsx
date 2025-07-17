import { Link, useNavigate } from "react-router";
import { useAppContext } from "../contexts/appContext";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast, SuccessToast } from "../utils/toastHelper";

const Navbar = () => {
    const { user = {}, cartItems = [] } = useAppContext();
    const navigate = useNavigate();
    const { isAuthenticated } = user;

    const handleLogout = async () => {
        try {
            await axiosInstance.get("/auth/logout");
            SuccessToast("Logout successful!");
            window.location.reload();
        } catch (err) {
            ErrorToast(err.message);
        }
    };

    const handleOpenProfilePage = () => navigate("/profile");
    const handleOpenCartPage = () => navigate("/cart");

    return (
        <div className="p-4 bg-indigo-900 shadow-md sticky top-0 z-50">
            <div className="flex justify-between items-center max-w-7xl mx-auto">
                <Link to="/" className="text-xl font-bold text-amber-50">
                    🛍️ Subify
                </Link>

                <div className="flex items-center gap-6">
                    <Link
                       to="/"
                       className="bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold px-4 py-2 rounded-full shadow hover:from-green-500 hover:to-green-700 transition duration-300 ease-in-out"
                     >
                       🏠 Home
                     </Link>

                    {isAuthenticated && (
                        <button
                            onClick={handleOpenCartPage}
                            className="relative bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg font-medium transition"
                        >
                            🛒 Cart
                            {cartItems.length > 0 && (
                                <span className="absolute top-[-8px] right-[-8px] bg-red-600 rounded-full w-5 h-5 flex items-center justify-center text-xs text-white font-bold">
                                    {cartItems.length}
                                </span>
                            )}
                        </button>
                    )}
                </div>

                {/* Right Section: Auth */}
                <div className="flex items-center gap-4">
                    {!isAuthenticated ? (
                        <>
                            <Link
                                to="/login"
                                className="text-indigo-700 font-semibold hover:underline"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-indigo-600 hover:bg-indigo-800 text-white px-4 py-1.5 rounded-lg font-medium transition"
                            >
                                Signup
                            </Link>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg font-medium transition"
                            >
                                Logout
                            </button>

                            <div
                                onClick={handleOpenProfilePage}
                                className="h-10 w-10 rounded-full bg-indigo-700 text-white font-bold flex items-center justify-center cursor-pointer hover:bg-indigo-900 transition"
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
