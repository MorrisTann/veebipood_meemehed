import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Lae ostukorv Local Storage'ist
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Salvesta ostukorv Local Storage'i
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Lisa toode ostukorvi
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Eemalda toode ostukorvist vaid määratud kogus
  const removeFromCart = (productId, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            // Kui eemaldatav kogus on väiksem kui olemasolev kogus,
            // vähenda kogust
            if (item.quantity > amount) {
              return { ...item, quantity: item.quantity - amount };
            }
            // Kui eemaldatav kogus on võrdne või suurem, eemaldame toote
            return null;
          }
          return item;
        })
        .filter((item) => item !== null)
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
