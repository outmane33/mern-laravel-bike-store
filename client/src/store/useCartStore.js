import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useCartStore = create((set) => ({
    cart: [],
    loading: false,
    error: null,
    total_cart_price: 0,

    getUserCart: async () => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.get("/api/cart");
            set({ cart: response.data.cart.items });
            set({ total_cart_price: response.data.cart.total_cart_price });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
    addProductToCart: async (data) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.post("/api/cart", data);
            set({ cart: response.data.cart.items });
            set({ total_cart_price: response.data.cart.total_cart_price });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
    deleteProductFromCart: async (data) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.put("/api/cart", data);
            set({ cart: response.data.cart.items });
            set({ total_cart_price: response.data.cart.total_cart_price });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
    updateCartItemQuantity: async (data) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.put(
                "/api/cart/updateQuantity",
                data
            );
            set({ cart: response.data.cart.items });
            set({ total_cart_price: response.data.cart.total_cart_price });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
    clearCart: async () => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.delete("/api/cart/clear");
            set({ cart: [] });
            set({ total_cart_price: response.data.cart.total_cart_price });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
}));
