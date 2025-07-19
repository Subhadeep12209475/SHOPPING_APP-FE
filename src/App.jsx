import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router";
import { useAppContext } from "./contexts/appContext";
import { BounceLoader } from "react-spinners";
import { SignupPage } from "./pages/SignupPage";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProfilePage } from "./pages/ProfilePage";
import { CartPage } from "./pages/CartPage"; 
import { ProductViewPage } from "./pages/ProductViewPage"; 
// import { OrderSummary } from "./pages/OrderSummary";
import { PlaceOrderPage } from "./pages/PlaceOrderPage";
// import {OrderProvider} from "./contexts/OrderContext";

const App = () => {
    const { appLoading, user } = useAppContext();

    const { isAuthenticated } = user;
    console.log("🟡 : App : isAuthenticated:", isAuthenticated);
    console.log("🟡 : App : isAuthenticated: final", !isAuthenticated);

    if (appLoading) {
        return (
            <div className="min-h-[100vh] flex flex-col items-center justify-center gap-10 content-center">
                <BounceLoader size="175" color="#2020ff" />
                <div className="border-1 border-lime-800 p-8 rounded-lg">
                    <p>Please note:</p>
                    <p>Backend is hosted on free server</p>
                    <p>It may take upto 2 minutes to warmup (for the first time)!</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/product/:id" element={<ProductViewPage />} />
                    <Route path="*" element={<LoginPage />} />
                </Routes>
            </BrowserRouter>
        );
    }

    return (
        //<OrderProvider>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signup" element={<HomePage />} />
                <Route path="/login" element={<HomePage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/cart" element={<CartPage />} />
                {/* <Route path="/place-order" element={<OrderSummary/>}/> */}
                <Route path="/product/:id" element={<ProductViewPage />} />
                <Route path="/place-order" element={<PlaceOrderPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
       // </OrderProvider>
    );
};

export default App;
