import React, { useEffect, useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useContext(CartContext);
  const [latestOrder, setLatestOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    // Keela scroll sisenemisel
    document.body.classList.add("overflow-hidden");
    return () => {
      // Luba scroll kui lehelt lahkutakse
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  useEffect(() => {
    const markAndLoadOrder = async () => {
      const sessionId = new URLSearchParams(location.search).get("session_id");
      const customerEmail = localStorage.getItem("checkoutEmail");

      if (!sessionId || !customerEmail) return;

      try {
        await fetch(`${process.env.REACT_APP_API_URL}/api/mark-order-paid`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });

        clearCart();

        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/guest-orders?email=${encodeURIComponent(customerEmail)}`);
        const orders = await res.json();

        if (Array.isArray(orders) && orders.length > 0) {
          const lastOrder = orders[0];
          setLatestOrder(lastOrder);
          setOrderItems(lastOrder.order_items || []);
        }
      } catch (err) {
        console.error("Tellimuse laadimine ebaõnnestus:", err);
      }
    };

    markAndLoadOrder();
  }, [location.search, clearCart]);

  if (!latestOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <p>Laadin tellimuse andmeid...</p>
      </div>
    );
  }

  const productItems = orderItems.filter(item => !item.name.toLowerCase().startsWith("tarne"));
  const shippingItem = orderItems.find(item => item.name.toLowerCase().startsWith("tarne"));

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-3xl w-full bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-bold text-green-600 mb-4 text-center">
          Makse õnnestus!
        </h1>
        <p className="text-center text-black text-sm mb-8">
          Saatsime Sulle tellimuse kinnituse e-mailile.
        </p>

        <div className="text-black text-sm space-y-2">
          <p><strong>Tellimus:</strong> #{latestOrder.id}</p>
          <p><strong>Tellija:</strong> {latestOrder.name} ({latestOrder.customer_email})</p>
          <p><strong>Tellimuse kuupäev:</strong> {new Date(latestOrder.order_date).toLocaleString()}</p>
          <p><strong>Tarneviis:</strong> {latestOrder.shipping_method || "-"}</p>
          {latestOrder.terminal_name && <p><strong>Pakiautomaat:</strong> {latestOrder.terminal_name}</p>}
          {latestOrder.pickup_location && <p><strong>Asukoht:</strong> {latestOrder.pickup_location}</p>}
          <p><strong>Aadress:</strong> {latestOrder.address1 || ""} {latestOrder.address2 || ""}, {latestOrder.city || ""} {latestOrder.postal_code || ""}, {latestOrder.country || ""}</p>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Tellitud tooted</h2>
          <div className="space-y-4">
            {productItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">Kogus: {item.quantity}</p>
                </div>
                <div className="text-right font-semibold">
                  {(item.price * item.quantity).toFixed(2)} €
                </div>
              </div>
            ))}
          </div>

          {shippingItem && (
            <div className="mt-8 border-t pt-4">
              <h2 className="text-lg font-semibold mb-2">Tarne</h2>
              <div className="flex justify-between">
                <span>{shippingItem.name}</span>
                <span className="font-semibold">{Number(shippingItem.price).toFixed(2)} €</span>
              </div>
            </div>
          )}

          <div className="text-right mt-6 font-bold text-lg">
            Kokku: {Number(latestOrder.total_price).toFixed(2)} €
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate("/pood")}
            className="bg-black text-white px-8 py-4 rounded-full hover:bg-gray-800 transition-all duration-300 text-lg font-bold"
          >
            Tagasi poodi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;
