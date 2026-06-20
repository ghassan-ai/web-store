'use client';
import { createContext, useState, useEffect, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const item = window.localStorage.getItem('cart');
      if (item) setCartItems(JSON.parse(item));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch { }
  }, [cartItems, hydrated]);

  const addToCart = (product, selections) => {
    const cartKey = selections
      ? `${product.id}_${JSON.stringify(selections)}`
      : product.id;

    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.cartKey === cartKey);
      if (existing) {
        return prevItems.map(item =>
          item.cartKey === cartKey ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, cartKey, selections: selections || null, quantity: 1 }];
    });
  };

  const removeFromCart = (cartKey) => {
    setCartItems(prevItems => prevItems.filter(item => (item.cartKey || item.id) !== cartKey));
  };

  const updateQuantity = (cartKey, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartKey);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        (item.cartKey || item.id) === cartKey ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
