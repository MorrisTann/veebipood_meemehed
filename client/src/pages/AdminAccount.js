import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const AdminAccount = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [showOrders, setShowOrders] = useState(true);
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/all-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Admin tellimusi ei saanud kätte:", err);
      }
    };

    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
        setProductList(res.data);
      } catch (err) {
        console.error("Tooteid ei saanud laadida:", err);
      }
    };

    fetchAllOrders();
    fetchProducts();
  }, []);

  const toggleOrder = (id) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const updateStock = async (id, newStock) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/admin/update-stock/${id}`,
        { stock: newStock },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProductList((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
      );
    } catch (err) {
      console.error("Laoseisu muutmine ebaõnnestus:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">

        {/* Tellimuste plokk */}
        <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => setShowOrders((prev) => !prev)}>
          <h1 className="text-3xl font-bold">Kõik tellimused (admin)</h1>
          {showOrders ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {showOrders && (
          orders.length === 0 ? (
            <p className="text-black">Tellimusi ei leitud.</p>
          ) : (
            <ul className="space-y-4">
              {orders.map((order) => (
                <li key={order.id} className="bg-gray-50 p-4 rounded shadow">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleOrder(order.id)}
                  >
                    <div>
                      <p className="font-semibold">Tellitud: {new Date(order.order_date).toLocaleString()}</p>
                      <p>Kokku: {order.total_price} €</p>
                      <p className={order.is_paid ? "text-green-600" : "text-red-500"}>
                        {order.is_paid ? "Makstud" : "Maksmata"}
                      </p>
                    </div>
                    {expandedOrders[order.id] ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                  {expandedOrders[order.id] && (
                    <div className="mt-3 space-y-2 text-black">
                      <p><strong>Nimi:</strong> {order.name}</p>
                      <p><strong>Telefon:</strong> {order.phone}</p>
                      <p><strong>E-mail:</strong> {order.customer_email}</p>
                      <p><strong>Ettevõte:</strong> {order.company}</p>
                      <p><strong>KMKR:</strong> {order.vat}</p>
                      <p><strong>Aadress:</strong> {order.address1} {order.address2}</p>
                      <p><strong>Linn / Postiindeks:</strong> {order.city} / {order.postal_code}</p>
                      <p><strong>Riik:</strong> {order.country}</p>
                      <p><strong>Tarneviis:</strong> {order.shipping_method}</p>
                      {order.terminal_name && <p><strong>Pakiautomaat:</strong> {order.terminal_name}</p>}
                      {order.pickup_location && <p><strong>Asukoht:</strong> {order.pickup_location}</p>}
                      <div>
                        <p><strong>Tooted:</strong></p>
                        <ul className="list-disc list-inside text-black">
                          {order.order_items.map((item, i) => (
                            <li key={i}>{item.name} x {item.quantity}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )
        )}

        {/* Laoseisu haldus */}
        <h2 className="text-2xl font-bold mt-10 mb-4">Laoseisu haldus</h2>
        <ul className="space-y-4">
          {productList.map((product) => (
            <li key={product.id} className="bg-gray-100 p-4 rounded shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">{product.name}</p>
                <p>Hetke laoseis: {product.stock} tk</p>
              </div>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  defaultValue={product.stock}
                  min="0"
                  onBlur={(e) => updateStock(product.id, parseInt(e.target.value))}
                  className="w-20 border p-1 rounded"
                />
                <span>tk</span>
              </div>
            </li>
          ))}
        </ul>

        {/* Logi välja */}
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="mt-10 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-300 font-bold"
        >
          Logi välja
        </button>
      </div>
    </div>
  );
};

export default AdminAccount;
