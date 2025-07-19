import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { Navbar } from "../components/navbar";

export const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();

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

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchQuery = queryParams.get("query") || "";
        if (searchQuery) {
            const filtered = products.filter(product =>
                product.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [location.search, products]);

    const handleViewProduct = (product) => {
        navigate(`/product/${product.id}`, { state: product });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100">
            <Navbar />

            {/* Hero Banner */}
            <header className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white py-16 text-center">
                <h2 className="text-5xl font-extrabold mb-2 drop-shadow-lg">Welcome to Subify</h2>
                <p className="text-white text-lg mb-4">Discover colorful deals on your favorite products.</p>
            </header>

            {/* Products Grid */}
            <div className="px-6 py-4">
                {loading ? (
                    <p className="text-center text-gray-700 text-lg">Loading products...</p>
                ) : (
                    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(product => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 border border-indigo-200"
                                >
                                    <img
                                        src={product.thumbnail}
                                        alt={product.title}
                                        className="w-full h-48 object-cover rounded-t-2xl"
                                        onClick={() => handleViewProduct(product)}
                                    />
                                    <div className="p-5 bg-gradient-to-br from-purple-50 to-pink-50 rounded-b-2xl">
                                        <h4 className="font-bold text-xl text-gray-800 truncate mb-2">
                                            {product.title}
                                        </h4>
                                        <p className="text-pink-600 font-semibold mb-3">
                                            ₹{product.price}
                                        </p>
                                        <button
                                            onClick={() => handleViewProduct(product)}
                                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-2 rounded-lg font-semibold shadow-md hover:shadow-xl transition"
                                        >
                                            View Product
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600 w-full col-span-full">
                                No products found.
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white py-4 text-center text-sm mt-10">
                © {new Date().getFullYear()} Subify. Made with ❤️ and colors.
            </footer>
        </div>
    );
};
