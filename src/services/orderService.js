import api from "../utils/api";

export const createOrder = async (payload) => {
  try {
    const { data } = await api.post("/orders", payload);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create order");
  }
};

export const getMyOrders = async () => {
  try {
    const { data } = await api.get("/orders/my-orders");
    return data.orders || [];
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch orders");
  }
};

export const getOrderById = async (orderId) => {
  try {
    const { data } = await api.get(`/orders/${orderId}`);
    return data.order;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch order detail");
  }
};

export const cancelOrder = async (orderId) => {
  try {
    const { data } = await api.patch(`/orders/${orderId}/cancel`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to cancel order");
  }
};
