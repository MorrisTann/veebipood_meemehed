import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const getImagePath = (imageName) => {
  try {
    return require(`../assets/${imageName}.jpg`);
  } catch (err) {
    return require(`../assets/default.jpg`);
  }
};

const getCartQuantity = (cart, productId) => {
  const item = cart.find((i) => i.id === productId);
  return item ? item.quantity : 0;
};

const ProductCard = ({ product, inCart, addToCart, navigate }) => {
  const stockLeft = product.stock - inCart;
  const isMaxReached = stockLeft <= 0;

  return (
    <div
      onClick={() => navigate(`/tooted/${product.slug}`)}
      className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer flex flex-col"
    >
      <img
        src={getImagePath(product.image_name)}
        alt={product.name}
        className="w-full h-64 object-cover"
      />
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
          <p className="text-xl font-bold text-black">{product.price}€</p>
        </div>

        <div className="mt-4">
          {stockLeft <= 4 && !isMaxReached && (
            <p className="text-bold text-orange-700 mb-2 font-medium">
              {stockLeft === 1
                ? "Ainult 1 veel laos!"
                : `Ainult ${stockLeft} veel laos!`}
            </p>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isMaxReached) addToCart(product);
            }}
            disabled={isMaxReached}
            className={`font-bold py-2 px-4 rounded transition duration-300 w-full ${
              isMaxReached
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : "bg-black text-white hover:text-amber-600"
            }`}
          >
            {isMaxReached ? "Välja müüdud" : "Lisa ostukorvi"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const { cart, addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/products`)
      .then((response) => setProducts(response.data))
      .catch((error) => console.error("Tooteid ei saanud laadida:", error));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            inCart={getCartQuantity(cart, product.id)}
            addToCart={addToCart}
            navigate={navigate}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
