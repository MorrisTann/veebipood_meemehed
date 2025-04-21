import React, { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useContext(CartContext);

  useEffect(() => {
    let executed = false;
  
    const markOrderPaid = async () => {
      const sessionId = new URLSearchParams(location.search).get("session_id");
      if (!sessionId || executed) return;
  
      executed = true;
  
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/mark-order-paid`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_id: sessionId }),
        });
  
        if (res.ok) {
          console.log("Tellimus märgiti makstuks");
          clearCart();
        }
      } catch (err) {
        console.error("Tellimuse makstuks märkimine ebaõnnestus:", err);
      }
    };
  
    markOrderPaid();
  
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);
  
    return () => clearTimeout(timer);
  }, []);
  

  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div className="max-w-md">
        <h1 className="text-4xl font-bold text-green-600 mb-4">Makse õnnestus!</h1>
        <p className="text-lg text-gray-700">Täname ostu eest.</p>
        <p className="text-sm text-gray-500 mt-2">Sind suunatakse automaatselt tagasi avalehele...</p>
      </div>
    </div>
  );
};

export default Success;
