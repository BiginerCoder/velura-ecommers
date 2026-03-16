import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [], totalAmount: 0 }); return; }
    try {
      setCartLoading(true);
      const { data } = await api.get("/cart");
      setCart(data);
    } catch {
      setCart({ items: [], totalAmount: 0 });
    } finally {
      setCartLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1, selectedVariants = {}) => {
    const { data } = await api.post("/cart/add", { productId, quantity, selectedVariants });
    setCart(data);
    return data;
  };

  const updateItem = async (productId, quantity) => {
    const { data } = await api.put("/cart/update", { productId, quantity });
    setCart(data);
  };

  const removeItem = async (productId) => {
    const { data } = await api.delete(`/cart/item/${productId}`);
    setCart(data);
  };

  const clearCart = async () => {
    const { data } = await api.delete("/cart/clear");
    setCart(data);
  };

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartLoading, fetchCart, addToCart, updateItem, removeItem, clearCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
