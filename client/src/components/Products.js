import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { CartContext } from "../context/CartContext";

const Products = () => {
  const { addToCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/products`)
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Tooteid ei saanud laadida:", error));
  }, []);

  const getImagePath = (imageName) => {
    try {
      return require(`../assets/${imageName}.jpg`);
    } catch (err) {
      return require(`../assets/default.jpg`); // Kui pilti ei leita, laetakse vaikimisi pilt
    }
  };

  return (
    <div>
      <h2>Tooted</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {products.map((product) => (
          <div key={product.id} style={{ border: "1px solid #ddd", padding: "10px", width: "200px" }}>
            <img src={getImagePath(product.image_name)} alt={product.name} style={{ width: "100%" }} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p><strong>{product.price}€</strong></p>
            <button onClick={() => addToCart(product)} style={{ backgroundColor: "green", color: "white", padding: "5px 10px", border: "none" }}>
              Lisa ostukorvi
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
