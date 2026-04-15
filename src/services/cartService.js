import api from '../utils/api';

export const CART_UPDATED_EVENT = 'cart-updated';

const emitCartUpdated = (count) => {
  window.dispatchEvent(
    new CustomEvent(CART_UPDATED_EVENT, {
      detail: { count },
    })
  );
};

export const getCart = async () => {
  try {
    const { data } = await api.get('/cart');
    return data.cart;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch cart');
  }
};

export const getCartItemCount = async () => {
  const cart = await getCart();
  return (cart.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
};

export const updateCartItemQty = async (itemId, quantity) => {
  try {
    const { data } = await api.patch(`/cart/${itemId}`, { quantity });

    const count = await getCartItemCount();
    emitCartUpdated(count);

    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update cart item');
  }
};

export const addToCart = async (productId, quantity = 1) => {
  try {
    const { data } = await api.post('/cart', {
      product_id: productId,
      quantity,
    });

    const count = await getCartItemCount();
    emitCartUpdated(count);

    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to add to cart');
  }
};

export const removeCartItem = async (itemId) => {
  try {
    const { data } = await api.delete(`/cart/${itemId}`);

    const count = await getCartItemCount();
    emitCartUpdated(count);

    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to remove cart item');
  }
};