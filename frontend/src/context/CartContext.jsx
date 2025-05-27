import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading } = useAuth();

  const fetchCart = useCallback(async () => {
    if (authLoading) {
      setLoading(true);
      return; // Wait for auth to complete
    }
    
    if (!user) {
      setCart(null);
      setError(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setCart(null);
        setError('Please log in to view your cart');
        setLoading(false);
        return;
      }

      const response = await api.get('/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setCart(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching cart:', err);
      if (err.response?.status === 401) {
        setCart(null);
        setError('Please log in to view your cart');
      } else {
        setError('Failed to fetch cart');
      }
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1, selectedSize = null) => {
    if (!user) {
      setError('Please login to add items to cart');
      return false;
    }

    try {
      setLoading(true);
      
      // Find if the item already exists in the cart with the SAME size
      const existingItem = cart?.items?.find(item => 
        item.product_id === productId && 
        (item.options?.size === selectedSize || (!item.options && !selectedSize))
      );
      
      const newQuantity = existingItem ? existingItem.quantity + quantity : quantity;

      const response = await api.post('/cart/items', {
        product_id: productId,
        quantity: newQuantity,
        // Include selectedSize in the request payload
        options: selectedSize ? { size: selectedSize } : null,
      });
      
      if (response.data && response.data.cart) {
        setCart(response.data.cart);
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error adding to cart:', err);
      if (err.response?.status === 401) {
        setError('Please log in to add items to your cart');
      } else {
        setError('Failed to add item to cart');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!user) {
      setError('Please login to update cart');
      return false;
    }

    try {
      setLoading(true);
      const response = await api.put(`/cart/items/${itemId}`, {
        quantity
      });
      
      if (response.data && response.data.cart) {
        setCart(response.data.cart);
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error updating quantity:', err);
      if (err.response?.status === 401) {
        setError('Please log in to update your cart');
      } else {
        setError('Failed to update quantity');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    if (!user) {
      setError('Please login to remove items from cart');
      return false;
    }

    try {
      setLoading(true);
      const response = await api.delete(`/cart/items/${itemId}`);
      
      if (response.data && response.data.cart) {
        setCart(response.data.cart);
        setError(null);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error removing item:', err);
      if (err.response?.status === 401) {
        setError('Please log in to remove items from your cart');
      } else {
        setError('Failed to remove item');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart(null);
    setError(null);
  };

  const getCartItemsCount = useCallback(() => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const value = {
    cart,
    loading: loading || authLoading,
    error,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart: fetchCart,
    getCartItemsCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 