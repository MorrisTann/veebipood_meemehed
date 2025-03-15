import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          // Kui vajutad tootekasti (välja arvatud nupp) siis navigeerib detailile:
          onClick={() => navigate(`/tooted/${product.id}`)}
          className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
        >
          <img
            src={getImagePath(product.image_name)}
            alt={product.name}
            className="w-full h-64 object-cover"
          />
          <div className="p-4">
            <h3 className="text-2xl font-semibold mb-2">{product.name}</h3>
            <p className="text-xl font-bold text-black mt-2">{product.price}€</p>
            <button
              onClick={(e) => {
                e.stopPropagation(); // ei lähe detailile, vaid lisab ostukorvi
                addToCart(product);
              }}
              className="mt-4 bg-black hover:text-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Lisa ostukorvi
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsPage;
