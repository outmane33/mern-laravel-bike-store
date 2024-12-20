import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
    user: null,
    loading: false,
    error: null,

    register: async (data) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.post(
                "/api/auth/register",
                data
            );
            set({ user: response.data.user, error: null });
        } catch (error) {
            console.error("Full registration error:", error);
            set({
                error: error.response?.data?.message || "Registration failed",
                user: null,
            });
            throw error;
        } finally {
            set({ loading: false });
        }
    },
    login: async (data) => {
        try {
            set({ loading: true, error: null });

            const response = await axiosInstance.post("/api/auth/signin", data);
            set({ user: response.data.user });
            set({ loading: false, error: null });
            console.log(response.data.user);
        } catch (error) {
            if (error.response) {
                set({
                    error: error.response.data.message || "Login failed",
                });
            } else if (error.request) {
                set({ error: "No response from server" });
            } else {
                set({ error: "Error setting up login request" });
            }
        }
    },
    logout: async () => {
        try {
            set({ loading: true, error: null });
            await axiosInstance.post("/api/auth/logout");
            set({ user: null });
        } catch (error) {
            console.error("Error logging out:", error);
        } finally {
            set({ loading: false });
        }
    },
    checkAuth: async () => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.get("/api/auth/checkauth");
            set({ user: response.data.user });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
}));
