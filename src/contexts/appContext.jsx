import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast } from "../utils/toastHelper";

const AppContext = createContext();

export function useAppContext() {
    return useContext(AppContext);
}

const AppContextProvider = ({ children }) => {
    const [appLoading, setAppLoading] = useState(true);
    const [user, setUser] = useState({ isAuthenticated: false });

    
    const [cartItems, setCartItems] = useState(() => {
        const storedCart = localStorage.getItem("cartItems");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const getUserDetails = async () => {
        try {
            setAppLoading(true);
            const resp = await axiosInstance.get("/users");
            if (resp.data.isSuccess) {
                setUser({
                    isAuthenticated: true,
                    ...resp.data.data.user,
                });
            } else {
                ErrorToast("Error in user validation", resp.data.message);
            }
        } catch (err) {
            ErrorToast("Error in user validation", err.message);
        } finally {
            setAppLoading(false);
        }
    };

    const addToCart = (product) => {
        setCartItems((prev) => [...prev, product]);
    };

    const removeFromCart = (index) => {
        setCartItems((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    const valueObj = {
        appLoading,
        user,
        cartItems,
        addToCart,
        removeFromCart,
    };

    return (
        <AppContext.Provider value={valueObj}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContextProvider };
