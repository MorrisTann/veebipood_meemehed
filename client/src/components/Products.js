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
      return require(`../assets/default.jpg`);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Tooted</h2>
      <div className="flex flex-wrap gap-5">
        {products.map((product) => (
          <div
            key={product.id}
            className="border border-gray-300 p-4 w-52 rounded shadow-sm bg-white"
          >
            <img
              src={getImagePath(product.image_name)}
              alt={product.name}
              className="w-full h-auto mb-2 rounded"
            />
            <h3 className="text-lg font-medium">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.description}</p>
            <p className="font-bold mt-1">{product.price}€</p>
            <button
              onClick={() => addToCart(product)}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
            >
              Lisa ostukorvi
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
