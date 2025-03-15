import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/products/${id}`)
      .then((response) => setProduct(response.data))
      .catch((error) => console.error("Toodet ei saanud laadida:", error));
  }, [id]);

  if (!product) {
    return <div className="text-center py-8">Laadimine...</div>;
  }

  // Piltide laadimiseks, kasutame dünaamilist require()-d
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
        <div className="flex flex-col md:flex-row">
          {/* Toote pilt */}
          <div className="md:w-1/2">
            <img
              src={getImagePath(product.image_name)}
              alt={product.name}
              className="w-full h-auto object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
            />
          </div>
          {/* Toote info */}
          <div className="md:w-1/2 p-6">
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="mb-2">
              <strong>Koostisosad:</strong> {product.ingredients}
            </p>
            <p className="mb-2">
              <strong>Milleks sobib:</strong> {product.suitable_uses}
            </p>
            <p className="mb-2">
              <strong>Parim enne:</strong> {product.best_before}
            </p>
            <p className="mb-2">
              <strong>Netokaal:</strong> {product.net_weight} g
            </p>
            <p className="mb-2">
              <strong>Allergeenid:</strong> {product.allergens}
            </p>
            <p className="mb-4">
              <strong>Hind 100g kohta:</strong> {product.price_per_100g}€
            </p>
            <button
              onClick={() => addToCart(product)}
              className="mt-6 bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Lisa ostukorvi
            </button>
          </div>
        </div>

        {/* Toitumisalane info, kuvatud vertikaalselt */}
        <div className="px-6 pb-6">
          <h2 className="text-2xl font-semibold mb-4">
            Toitumisalane info (100g kohta)
          </h2>
          <dl className="space-y-2">
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <dt className="font-semibold">Energia</dt>
              <dd>{product.nutrition.energy}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <dt className="font-semibold">Rasvad</dt>
              <dd>{product.nutrition.fats}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <dt className="font-semibold">Küllastunud rasvhapped</dt>
              <dd>{product.nutrition.saturatedFats}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <dt className="font-semibold">Süsivesikud</dt>
              <dd>{product.nutrition.carbohydrates}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-1">
              <dt className="font-semibold">Suhkrud</dt>
              <dd>{product.nutrition.sugars}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-1">
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
