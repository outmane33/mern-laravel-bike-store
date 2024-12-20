import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useWishlistStore = create((set) => ({
    wishlist: [],
    loading: false,
    error: null,

    userWishlist: async () => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.get("/api/wishlist");
            set({ wishlist: response.data.wishlist });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
    addProductToWishlist: async (data) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.post("/api/wishlist", data);
            set({ wishlist: response.data.wishlist });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
    removeProductFromWishlist: async (id) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.delete(`/api/wishlist/${id}`);
            set({ wishlist: response.data.wishlist });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
}));
