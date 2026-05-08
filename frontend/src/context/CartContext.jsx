import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const { token, user } = useContext(AuthContext);

  useEffect(() => {
    const fetchCart = async () => {
      if (token && user) {
        try {
          const res = await axios.get('http://localhost:5000/api/cart');
          setCart(res.data);
        } catch (err) {
          console.error('Error fetching cart', err);
        }
      } else {
        setCart(null);
      }
    };
    fetchCart();
  }, [token, user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!token) return toast.error('Please login to add items to cart');
    try {
      const res = await axios.post('http://localhost:5000/api/cart/add', { productId, quantity });
      setCart(res.data);
      toast.success('Added to cart!');
    } catch (err) {
      console.error('Error adding to cart', err);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await axios.post('http://localhost:5000/api/cart/remove', { productId });
      setCart(res.data);
    } catch (err) {
      console.error('Error removing from cart', err);
    }
  };

  const checkout = async (shippingAddress, paymentMethod) => {
    try {
      const res = await axios.post('http://localhost:5000/api/orders', { shippingAddress, paymentMethod });
      // Reset cart locally
      setCart({ ...cart, products: [] });
      return res.data;
    } catch (err) {
      console.error('Checkout error', err);
      throw err;
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, checkout }}>
      {children}
    </CartContext.Provider>
  );
};
