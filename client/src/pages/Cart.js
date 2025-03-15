import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

// Abifunktsioon pildi laadimiseks
const getImagePath = (imageName) => {
  try {
    return require(`../assets/${imageName}.jpg`);
  } catch (err) {
    return require(`../assets/default.jpg`);
  }
};

const Cart = () => {
  const { cart, removeFromCart } = useContext(CartContext);
  const [removalAmounts, setRemovalAmounts] = useState({});
  const navigate = useNavigate();

  // Initsialiseeri eemaldamise kogused igale tootele, seades väärtuseks toote koguse
  useEffect(() => {
    const initialAmounts = {};
    cart.forEach((item) => {
      initialAmounts[item.id] = item.quantity;
    });
    setRemovalAmounts(initialAmounts);
  }, [cart]);

  const handleRemovalAmountChange = (id, value) => {
    setRemovalAmounts((prev) => ({ ...prev, [id]: Number(value) }));
  };

  const totalPrice = cart.reduce(
    (total, item) => total + parseFloat(item.price) * item.quantity,
    0
  );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Ostukorv</h1>
      {cart.length === 0 ? (
        <p className="text-lg text-gray-600 text-center">Ostukorv on tühi.</p>
      ) : (
        <div>
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex flex-col sm:flex-row justify-between items-center bg-white shadow-md rounded p-4"
              >
                <div className="flex items-center">
                  {/* Pisike pilt */}
                  <img
                    src={getImagePath(item.image_name)}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div>
                    <h3 className="text-2xl font-semibold">{item.name}</h3>
                    <p className="text-gray-700">Kogus: {item.quantity}</p>
                    <p className="text-gray-700">
                      Hind (kokku):{" "}
                      {(parseFloat(item.price) * item.quantity).toFixed(2)} €
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center">
                  {/* Eemaldamiseks sisendi väli, algväärtuseks toote kogus */}
                  <input
                    type="number"
                    min="1"
                    max={item.quantity}
                    value={removalAmounts[item.id] || item.quantity}
                    onChange={(e) =>
                      handleRemovalAmountChange(item.id, e.target.value)
                    }
                    className="border border-gray-300 rounded px-2 py-1 w-20 text-center mr-2"
                  />
                  <button
                    onClick={() =>
                      removeFromCart(item.id, removalAmounts[item.id] || item.quantity)
                    }
                    title="Eemalda tooted"
                    className="mt-4 sm:mt-0 bg-red-500 text-white font-bold p-2 rounded hover:bg-red-600 transition duration-300"
                  >
                    {/* Inline SVG ikoon - prillikas "trash" ikoon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v0a2 2 0 01-2 2h-4a2 2 0 01-2-2v0a2 2 0 012-2z"
                      />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex justify-between items-center">
            <h2 className="text-3xl font-bold">
              Kokku: {totalPrice.toFixed(2)} €
            </h2>
            <button
              onClick={() => navigate("/payment")}
              className="bg-green-500 text-white font-bold py-2 px-6 rounded hover:bg-green-600 transition duration-300"
            >
              Maksa
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
