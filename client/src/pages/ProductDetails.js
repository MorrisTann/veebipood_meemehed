import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const { cart, addToCart } = useContext(CartContext);
  
  useEffect(() => {
    if (!slug) return;
    
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/products/slug/${slug}`)
      .then((response) => setProduct(response.data))
      .catch((error) => {
        console.error("Toodet ei saanud laadida:", error?.response?.data || error.message || error);
      });
  }, [slug]);

  const getCartQuantity = (productId) => {
    const item = cart.find((i) => i.id === productId);
    return item ? item.quantity : 0;
  };

  if (!product) return <div className="text-center py-8">Laadimine...</div>;

  const inCart = getCartQuantity(product.id);
  const stockLeft = product.stock - inCart;
  const isOutOfStock = product.stock === 0;
  const isMaxReached = stockLeft <= 0;

  const getImagePath = (imageName) => {
    try {
      return require(`../assets/${imageName}.jpg`);
    } catch (err) {
      return require(`../assets/default.jpg`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center">
          <div className="md:w-1/2">
            <img
              src={getImagePath(product.image_name)}
              alt={product.name}
              className="w-full h-auto object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
            />
          </div>
          <div className="md:w-1/2 p-6">
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="mb-2"><strong>Koostisosad:</strong> {product.ingredients}</p>
            <p className="mb-2"><strong>Milleks sobib:</strong> {product.suitable_uses}</p>
            <p className="mb-2"><strong>Parim enne:</strong> {product.best_before}</p>
            <p className="mb-2"><strong>Netokaal:</strong> {product.net_weight} g</p>
            <p className="mb-2"><strong>Allergeenid:</strong> {product.allergens}</p>
            <p className="mb-4"><strong>Hind 100g kohta:</strong> {product.price_per_100g}€</p>
            {stockLeft <= 4 && !isMaxReached && (
              <p className="text-bold text-orange-700 mb-2 font-medium">
                {stockLeft === 1
                  ? "Ainult 1 veel laos!"
                  : `Ainult ${stockLeft} veel laos!`}
              </p>
            )}

            <button
              onClick={() => addToCart(product)}
              disabled={isMaxReached}
              className={`mt-4 font-bold py-2 px-4 rounded transition duration-300 ${
                isMaxReached
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {isMaxReached ? "Välja müüdud" : "Lisa ostukorvi"}
            </button>
          </div>
        </div>

        <div className="px-6 pb-6">
          <h2 className="text-2xl font-semibold mb-4">
            Toitumisalane info (100g kohta)
          </h2>
          <dl className="space-y-2">
            <div className="flex justify-between border-b pb-1">
              <dt className="font-semibold">Energia</dt>
              <dd>{product.nutrition.energy}</dd>
            </div>
            <div className="flex justify-between border-b pb-1">
              <dt className="font-semibold">Rasvad</dt>
              <dd>{product.nutrition.fats}</dd>
            </div>
            <div className="flex justify-between border-b pb-1">
              <dt className="font-semibold">Küllastunud rasvhapped</dt>
              <dd>{product.nutrition.saturatedFats}</dd>
            </div>
            <div className="flex justify-between border-b pb-1">
              <dt className="font-semibold">Süsivesikud</dt>
              <dd>{product.nutrition.carbohydrates}</dd>
            </div>
            <div className="flex justify-between border-b pb-1">
              <dt className="font-semibold">Suhkrud</dt>
              <dd>{product.nutrition.sugars}</dd>
            </div>
            <div className="flex justify-between border-b pb-1">
              <dt className="font-semibold">Valgud</dt>
              <dd>{product.nutrition.proteins}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-semibold">Sool</dt>
              <dd>{product.nutrition.salt}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
