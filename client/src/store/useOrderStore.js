import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useOrderStore = create((set, get) => ({
    order: null,
    loading: false,
    orders: [],
    details: [],
    setIsOrderCreated: (value) => set({ isOrderCreated: value }),

    cashOrder: async (data) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.post(
                "/api/orders/cashorder",
                data
            );
            set({ order: response.data.order });
            window.location.href = `/order/${response.data.order.id}`;
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
    cartOrder: async (data) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.post(
                "/api/orders/checkoutSesseion",
                data
            );
            set({ order: response.data.order });
            window.location.href = `${response.data.checkoutUrl}`;
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
    getAllOrders: async () => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.get("/api/orders");
            set({ orders: response.data.orders });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
    deleteOrder: async (id) => {
        try {
            set({ loading: true, error: null });
            await axiosInstance.delete(`/api/orders/${id}`);
            set({ orders: get().orders.filter((order) => order.id !== id) });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
    getOrderDetails: async (id) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.get(`/api/orders/${id}`);
            set({ order: response.data.order });
            set({ details: response.data.details });
        } catch (error) {
            console.error("Error checking authentication:", error);
        } finally {
            set({ loading: false });
        }
    },
    updateOrder: async (id, data) => {
        try {
            set({ loading: true, error: null });
            const response = await axiosInstance.put(`/api/orders/${id}`, data);
            set({
                orders: [
                    ...get().orders.filter((order) => order.id !== id),
                    response.data.order,
                ],
            });
        } catch (error) {
            console.error("Error updating order:", error);
            set({ error: error.message });
        } finally {
            set({ loading: false });
        }
    },
}));
