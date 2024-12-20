import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import Product from "./pages/Product";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Order from "./pages/Order";
import AdminPage from "./pages/admin/AdminPage";
import OnlyAdminPrivateRoute from "./components/admin/OnlyAdminPrivateRoute";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";

function App() {
    // const user = useSelector((state) => state.auth.user);
    const { user, checkAuth } = useAuthStore();
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);
    return (
        <>
            <BrowserRouter>
                <Header />
                <Routes>
                    {/* admin */}
                    <Route element={<OnlyAdminPrivateRoute />}>
                        <Route path="/admin/:content" element={<AdminPage />} />
                        <Route
                            path="/admin/:content/:orderId"
                            element={<AdminPage />}
                        />
                    </Route>
                    <Route path="*" element={<Home />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/product/:slug" element={<Product />} />
                    <Route path="/order/:orderId" element={<Order />} />
                </Routes>
                <Footer />
            </BrowserRouter>
        </>
    );
}

export default App;
