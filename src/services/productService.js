import { API_BASE_URL } from '../constants';

export const getAllCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getProductsByCategory = async (categoryId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${categoryId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/product/${productId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    const data = await response.json();
    return data.product; // API returns a single product in a 'product' field
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const searchProducts = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};