import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { SuccessToast, ErrorToast } from "../utils/toastHelper";

export const ProductViewPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchProductDetails = async () => {
        try {
            const res = await axios.get(`https://dummyjson.com/products/${id}`);
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
            await axios.post("http://localhost:2900/api/v1/cart/add", {
                item: {
                    productId: product.id,
                    title: product.title,
                    price: product.price,
                    thumbnail: product.thumbnail
                }
            }, { withCredentials: true });

            SuccessToast(`${product.title} added to cart!`);
            navigate("/cart");   // Optional: Navigate to cart after adding
        } catch (error) {
            console.error("Error adding to cart:", error);
            ErrorToast("Failed to add product to cart.");
        }
    };

    if (loading) {
        return <p className="text-center py-10 text-gray-500">Loading product...</p>;
    }

    if (!product) {
        return <p className="text-center py-10 text-red-500">Unable to fetch details.</p>;
    }

    return (
        <div className="min-h-screen bg-blue-100 flex justify-center items-center py-10 px-4">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                <img src={product.thumbnail} alt={product.title} className="w-full h-64 object-cover rounded-lg mb-4" />
                <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
                <p className="text-indigo-700 font-semibold mb-4 text-lg">₹{product.price}</p>
                <p className="text-gray-700 mb-4 font-medium">{product.description}</p>

                <p className="mb-1"><strong>Brand:</strong> {product.brand}</p>
                <p className="mb-1"><strong>Category:</strong> {product.category}</p>
                <p className="mb-1"><strong>Rating:</strong> {product.rating} ⭐</p>
                <p className="mb-1"><strong>Discount:</strong> {product.discountPercentage}%</p>
                <p className="mb-1"><strong>Stock:</strong> {product.stock}</p>

                <button
                    onClick={handleAddToCart}
                    className="w-full bg-indigo-700 hover:bg-indigo-900 text-white py-3 rounded-lg font-semibold mt-6 transition"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};
