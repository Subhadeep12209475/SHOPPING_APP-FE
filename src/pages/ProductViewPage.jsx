import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { SuccessToast, ErrorToast } from "../utils/toastHelper";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const ProductViewPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchProductDetails = async () => {
        try {
            const res = await axios.get(`https://dummyjson.com/products/${id}`);
            console.log("Fetched Product:", res.data);
            setProduct(res.data);
        } catch (err) {
            console.error("Unable to fetch details:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const handleAddToCart = async () => {
        if (!product) return;
        try {
            await axios.post(`${BASE_URL}/cart/add`, {
                item: {
                    productId: product.id,
                    title: product.title,
                    price: product.price,
                    thumbnail: product.thumbnail
                }
            }, { withCredentials: true });

            SuccessToast(`${product.title} added to cart!`);
            navigate("/cart");
        } catch (error) {
            console.error("Error adding to cart:", error);
            ErrorToast("Failed to add product to cart.");
        }
    };

    if (loading) {
        return <p className="text-center py-20 text-gray-500 text-xl">Loading product...</p>;
    }

    if (!product) {
        return <p className="text-center py-20 text-red-500 text-xl">Unable to fetch product details.</p>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center px-4 py-10">
            <div className="max-w-7xl w-full mx-auto bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col lg:flex-row">
                
                {/* Image Section */}
                <div className="lg:w-1/2 bg-gray-200">
                    <img
                        src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/400x400.png?text=No+Image'}
                        alt={product.title}
                        className="object-cover w-full h-full"
                        onError={(e) => e.target.src = 'https://via.placeholder.com/400x400.png?text=Image+Not+Found'}
                    />
                </div>

                {/* Details Section */}
                <div className="lg:w-1/2 p-8 flex flex-col justify-between">
                    <div>
                        <h1 className="text-4xl font-bold mb-4 text-gray-800">{product.title}</h1>
                        <p className="text-lg text-gray-600 mb-6">{product.description}</p>

                        <div className="space-y-2 mb-8">
                            <p><span className="font-semibold">Brand:</span> {product.brand}</p>
                            <p><span className="font-semibold">Category:</span> {product.category}</p>
                            <p><span className="font-semibold">Rating:</span> {product.rating} ⭐</p>
                            <p><span className="font-semibold">Discount:</span> {product.discountPercentage}%</p>
                            <p><span className="font-semibold">Stock Available:</span> {product.stock}</p>
                            <p><span className="font-semibold">Total Images:</span> {product.images?.length || 0}</p>
                        </div>

                        <p className="text-3xl font-extrabold text-indigo-700 mb-8">₹{product.price}</p>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="bg-indigo-700 hover:bg-indigo-900 text-white text-lg font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg"
                    >
                        🛒 Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};
