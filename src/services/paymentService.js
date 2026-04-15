import api from "../utils/api";

export const confirmPayment = async ({ orderId, provider, transactionCode }) => {
  try {
    const { data } = await api.post(`/payments/order/${orderId}/confirm`, {
      provider,
      transaction_code: transactionCode,
    });
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to confirm payment");
  }
};
