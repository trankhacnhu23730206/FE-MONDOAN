import api from "../utils/api";

export const getMyProfile = async () => {
  try {
    const { data } = await api.get("/auth/me");
    return data.user;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch profile");
  }
};

export const updateMyProfile = async (payload) => {
  try {
    const { data } = await api.put("/auth/me", payload);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update profile");
  }
};
