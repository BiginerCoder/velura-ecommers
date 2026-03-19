import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { PrivateRoute, AdminRoute } from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import SingleProduct from "./pages/SingleProduct";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import { Login, Register } from "./pages/Auth";
import Orders from "./pages/Orders";
import { Profile, OrderSuccess } from "./pages/ProfileAndSuccess";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import "./styles/global.css";

const App = () => {
  console.log("API URL:", import.meta.env.VITE_API_URL);
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                borderRadius: "6px",
              },
              success: {
                style: { background: "#1A1A2E", color: "#fff" },
                iconTheme: { primary: "#C4956A", secondary: "#fff" },
              },
              error: {
                style: { background: "#fff", color: "#C1440E", border: "1px solid #f8d7d0" },
              },
            }}
          />
          <Navbar />

          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<SingleProduct />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Protected — authenticated users */}
            <Route element={<PrivateRoute />}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/order-success/:id" element={<OrderSuccess />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Protected — admin only */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<Admin />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <Footer />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
