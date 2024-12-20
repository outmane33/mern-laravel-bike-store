import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useReviewStore = create((set, get) => ({
    reviews: [],
    loading: false,
    error: null,

    addReview: async (data) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.post("/api/review", data);
            set({ reviews: response.data.reviews });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
    getReviewsForProduct: async (slug) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.get(`/api/review/${slug}`);
            set({ reviews: response.data.reviews });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
    updateReview: async (id, data) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.put(`/api/review/${id}`, data);
            set({ reviews: [...get().reviews, response.data.review] });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
    deleteReview: async (id) => {
        try {
            set({ loading: true, error: null });
            await axiosInstance.delete(`/api/review/${id}`);
            set({
                reviews: get().reviews.filter((review) => review.id !== id),
            });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
}));
