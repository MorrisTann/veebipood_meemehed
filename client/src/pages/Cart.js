import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { FaTrash } from "react-icons/fa";

const getImagePath = (imageName) => {
  try {
    return require(`../assets/${imageName}.jpg`);
  } catch {
    return require(`../assets/default.jpg`);
  }
};

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();

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
                  <img
                    src={getImagePath(item.image_name)}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div>
                  <Link
                    to={`/tooted/${item.id}`}
                    className="block text-2xl font-semibold text-black hover:text-amber-600 transition"
                  >
                    {item.name}
                  </Link>
                  <p className="text-gray-700 text-left">Hind: {parseFloat(item.price).toFixed(2)} €</p>
                  <p className="text-gray-700 text-left">Kokku: {(parseFloat(item.price) * item.quantity).toFixed(2)} €</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 sm:mt-0">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, Number(e.target.value))
                    }
                    className="border border-gray-300 rounded px-2 py-1 h-10 w-20 text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    onClick={() => removeFromCart(item.id, item.quantity)}
                    title="Eemalda tooted"
                    className="h-10 w-10 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300 flex items-center justify-center"
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap justify-between items-center gap-4">
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
