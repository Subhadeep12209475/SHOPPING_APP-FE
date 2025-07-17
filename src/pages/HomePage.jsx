import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { Navbar } from "../components/navbar";

export const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            const response = await axios.get("https://dummyjson.com/products?limit=100");
            setProducts(response.data.products);
            setFilteredProducts(response.data.products);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearch = () => {
        const filtered = products.filter(product =>
            product.title.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const handleViewProduct = (product) => {
        navigate(`/product/${product.id}`, { state: product });
    };

    return (
        <div className="min-h-screen bg-blue-100">
            <Navbar />

            {/* Top Buttons Row */}
            {/* <div className="flex justify-center gap-4 bg-white py-4 shadow-md sticky top-0 z-40">
                <Link to="/" className="bg-indigo-700 hover:bg-indigo-900 text-white px-4 py-2 rounded-lg font-semibold">
                    Home
                </Link>
                <Link to="/profile" className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold">
                    Profile
                </Link>
                <Link to="/cart" className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold">
                    🛒 Cart
                </Link>
            </div> */}

            {/* Hero Banner */}
            <header className="bg-indigo-700 text-white py-16 text-center">
                <h2 className="text-4xl font-bold mb-2">Welcome to Subify</h2>
                <p className="text-indigo-200 mb-4">Shop the latest products at great prices.</p>
                {/* <Link
                    to="/cart"
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-lg transition"
                >
                    Shop Now
                </Link> */}
            </header>

            {/* Search Bar */}
            <div className="flex justify-center items-center gap-4 p-6">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-1/2 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                    onClick={handleSearch}
                    className="bg-indigo-700 hover:bg-indigo-900 text-white px-5 py-2 rounded-lg font-semibold"
                >
                    Search
                </button>
            </div>

            {/* Products Grid */}
            <div className="px-6 py-4">
                {loading ? (
                    <p className="text-center text-gray-600 text-lg">Loading products...</p>
                ) : (
                    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
                                >
                                    <img
                                        src={product.thumbnail}
                                        alt={product.title}
                                        className="w-full h-48 object-cover rounded-t-xl"
                                        onClick={() => handleViewProduct(product)}
                                    />
                                    <div className="p-4">
                                        <h4 className="font-bold text-lg text-gray-800 truncate">
                                            {product.title}
                                        </h4>
                                        <p className="text-indigo-700 font-semibold mb-3">
                                            ₹{product.price}
                                        </p>
                                        <button
                                            onClick={() => handleViewProduct(product)}
                                            className="w-full bg-indigo-700 text-white py-2 rounded-lg hover:bg-indigo-900 transition"
                                        >
                                            View Product
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500 w-full col-span-full">
                                No products found.
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-white shadow mt-10 py-4 text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} Subify. Built with ❤️ by Your Team.
            </footer>
        </div>
    );
};
