import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    console.log("Cart saved to localStorage:", cart);
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        if (existingProduct.quantity >= product.stock) {
          alert(`Laos on ainult ${product.stock} tk. Rohkem ei saa lisada.`);
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        if (product.stock < 1) {
          alert(`Toode "${product.name}" on otsas.`);
          return prevCart;
        }
        return [...prevCart, { 
          id: product.id,
          name: product.name,
          price: product.price,
          image_name: product.image_name,
          slug: product.slug,
          stock: product.stock,
          quantity: 1
        }];
      }
    });
  };
  

  const removeFromCart = (productId, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            if (item.quantity > amount) {
              return { ...item, quantity: item.quantity - amount };
            }
            return null;
          }
          return item;
        })
        .filter((item) => item !== null)
    );
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
