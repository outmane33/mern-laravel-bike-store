import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useProductStore = create((set, get) => ({
    products: [],
    loading: false,
    error: null,
    product: null,
    categories: [],
    colors: [],
    dataColors: [],
    images: [],

    getAllProducts: async (query) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.get(query);
            set({ products: response.data.products });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
    addProduct: async (data) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.post("/api/products", data);
            set({ products: response.data.products });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
    updateProduct: async (id, data) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.put(
                `/api/products/${id}`,
                data
            );
            set({ products: response.data.products });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
    getProduct: async (slug) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.get(`/api/products/${slug}`);
            set({ product: response.data.product });
            set({ images: response.data.images });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
    deleteProduct: async (id) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.delete(`/api/products/${id}`);
            set({ products: response.data.products });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
    getAllCategories: async () => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.get(
                "/api/products/categories"
            );
            set({ categories: response.data.categories });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
    addCategory: async (categoryData) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.post(
                "/api/products/categories",
                categoryData
            );
            set({ categories: [...get().categories, response.data.category] });
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    },
    getAllColors: async () => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.get("/api/products/colors");
            set({ colors: response.data.colors });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },

    getDataColors: async () => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.get("/api/colors");
            set({ dataColors: response.data.colors });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
    getProductColors: async (id) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.get(`api/colors/${id}`);
            set({ colors: response.data.colors });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
    addColor: async (colorData) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.post(
                "/api/products/colors",
                colorData
            );
            set({ colors: [...get().colors, response.data.color] });
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    },
}));
