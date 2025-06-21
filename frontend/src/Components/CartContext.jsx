import React, { createContext, useState, useEffect, useContext } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [initialized, setInitialized] = useState(false);

  const fetchCartCount = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/cart-count/", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCartCount(data.cart_total_items);
      }
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  // Initialize cart count on first load
  useEffect(() => {
    if (!initialized) {
      fetchCartCount();
      setInitialized(true);
    }
  }, [initialized]);

  const updateCartCount = async () => {
    await fetchCartCount();
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
