"use client"; // 🚀 CRUCIAL: Tells Next.js to run this file only on the browser client

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize with an empty array to match the server's pre-rendered shell safely
  const [items, setItems] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // Prevents wiping storage before it's read

  // 1. Load cart from localStorage ONLY once mounted on the client browser
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('shopping_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (err) {
      console.error("Failed to parse shopping cart from localStorage:", err);
    } finally {
      setIsLoaded(true); // Mark as safely loaded
    }
  }, []);

  // 2. Save to localStorage every time the items array changes (Skip initial server pass)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('shopping_cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  // 3. Calculate Total Price (Unit Price * Quantity)
  const totalPrice = useMemo(() => {
    return items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 1;
      return sum + (price * qty);
    }, 0);
  }, [items]);

  // 4. Formatter for KES Currency
  const formatCurrency = (amount) => 
    new Intl.NumberFormat('en-KE', { 
      style: 'currency', 
      currency: 'KES',
      minimumFractionDigits: 0 
    }).format(amount);

  // 5. Update Quantity Logic
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // 6. Add to Cart Logic (Fixed for 9M bug and Duplicates)
  const addToCart = (product) => {
    const numericPrice = typeof product.price === 'string' 
      ? parseFloat(product.price) 
      : Number(product.price);

    const incomingQuantity = Number(product.quantity) || 1;

    setItems((prev) => {
      const existingItem = prev.find(item => item.id === product.id);

      if (existingItem) {
        return prev.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + incomingQuantity } 
            : item
        );
      }

      return [...prev, {
        ...product,
        price: numericPrice,
        quantity: incomingQuantity
      }];
    });

    setIsPopupOpen(true);
    setTimeout(() => setIsPopupOpen(false), 3000);
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('shopping_cart');
    }
  };

  return (
    <CartContext.Provider value={{ 
      items, 
      totalPrice, 
      addToCart, 
      removeItem, 
      updateQuantity,
      clearCart, 
      formatCurrency, 
      isPopupOpen, 
      setIsPopupOpen 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
