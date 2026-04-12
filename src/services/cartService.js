import { API_BASE_URL } from '../constants';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const getCart = async () => {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch cart');
  }

  return data.cart;
};

export const updateCartItemQty = async (itemId, quantity) => {
  const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ quantity }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update cart item');
  }

  return data;
};

export const addToCart = async (productId, quantity = 1) => {
  const response = await fetch(`${API_BASE_URL}/cart`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ product_id: productId, quantity }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to add to cart');
  }

  return data;
};

export const removeCartItem = async (itemId) => {
  const response = await fetch(`${API_BASE_URL}/cart/${itemId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to remove cart item');
  }

  return data;
};