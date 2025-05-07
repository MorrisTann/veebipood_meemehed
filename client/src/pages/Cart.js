import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { FaTrash } from "react-icons/fa";
import axios from "axios";

const getImagePath = (imageName) => {
  try {
    return require(`../assets/${imageName}.jpg`);
  } catch {
    return require(`../assets/default.jpg`);
  }
};

const ConfirmModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-sm">
      <p className="font-bold text-black text-center mb-6">
        Kas oled kindel, et soovid toote eemaldada?
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onCancel}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
        >
          Ei (Õige valik)
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Jah
        </button>
      </div>
    </div>
  </div>
);

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);
  const navigate = useNavigate();
  const [stockMap, setStockMap] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
        const stockData = {};
        res.data.forEach(p => {
          stockData[p.id] = p.stock;
        });
        setStockMap(stockData);
      } catch (err) {
        console.error("Laoseisu laadimine ebaõnnestus:", err);
      }
    };
    fetchStock();
  }, [cart]);

  const totalPrice = cart.reduce(
    (total, item) => total + parseFloat(item.price) * item.quantity,
    0
  );

  const confirmDelete = (itemId, quantity, isOutOfStock) => {
    if (isOutOfStock) {
      removeFromCart(itemId, quantity);
    } else {
      setPendingDelete({ id: itemId, quantity });
      setShowModal(true);
    }
  };

  const handleDelete = () => {
    if (pendingDelete) {
      removeFromCart(pendingDelete.id, pendingDelete.quantity);
      setPendingDelete(null);
      setShowModal(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {showModal && (
        <ConfirmModal
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}

      <h1 className="text-4xl font-bold mb-6 text-center">Ostukorv</h1>

      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Ostukorv on tühi.</p>
          <button
            onClick={() => navigate("/pood")}
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded transition"
          >
            Tagasi poodi
          </button>
        </div>
      ) : (
        <div>
          <ul className="space-y-4">
            {cart.map((item) => {
              const stock = stockMap[item.id] ?? item.stock;
              const isOutOfStock = stock === 0;

              return (
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
                        to={`/tooted/${item.slug}`}
                        className="block text-2xl font-semibold text-black hover:text-amber-600 transition"
                      >
                        {item.name}
                      </Link>
                      <p className="text-gray-700 text-left">
                        Hind: {parseFloat(item.price).toFixed(2)} €
                      </p>
                      <p className="text-gray-700 text-left">
                        Kokku: {(parseFloat(item.price) * item.quantity).toFixed(2)} €
                      </p>
                      {isOutOfStock ? (
                        <p className="text-red-600 font-semibold mt-1">Toode ei ole enam saadaval</p>
                      ) : (
                        stock <= 4 && (
                          <p className="text-sm text-amber-600 mt-1">
                            {stock === 0
                              ? "See toode ei ole enam saadaval!"
                              : `Ainult ${stock} tk veel laos`}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    {isOutOfStock ? (
                      <span className="text-red-600"></span>
                    ) : (
                      <input
                        type="number"
                        min="1"
                        max={stock}
                        value={item.quantity}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          if (value > stock || value < 1 || isNaN(value)) return;
                          updateQuantity(item.id, value);
                        }}
                        className="border border-gray-300 rounded px-2 py-1 h-10 w-20 text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    )}
                    <button
                      onClick={() => confirmDelete(item.id, item.quantity, isOutOfStock)}
                      title="Eemalda tooted"
                      className="text-black hover:text-red-500 transition duration-300"
                    >
                      <FaTrash className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 flex flex-wrap justify-between items-center gap-4">
            <h2 className="text-3xl font-bold">
              Kokku: {totalPrice.toFixed(2)} €
            </h2>
            <button
              onClick={() => navigate("/payment?start=true")}
              className="bg-green-500 text-white font-bold py-2 px-6 rounded hover:bg-green-600 transition duration-300"
            >
              Tellimust vormistama
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
