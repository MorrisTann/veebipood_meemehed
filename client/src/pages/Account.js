import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const Account = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [newsletter, setNewsletter] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [showRecipe, setShowRecipe] = useState(true);
  const [showOrders, setShowOrders] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data);
      } catch (err) {
        console.log("Tokeniga ei saanud – proovime emaili põhjal");
        if (user?.email) {
          try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/guest-orders?email=${encodeURIComponent(user.email)}`);
            setOrders(res.data);
          } catch (e) {
            console.error("Guest tellimusi ei saanud kätte:", e);
            setOrders([]);
          }
        }
      }
    };
    fetchOrders();
  }, [user?.email]);

  useEffect(() => {
    if (user?.email) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/newsletter?email=${encodeURIComponent(user.email)}`)
        .then((res) => {
          setNewsletter(res.data.subscribed);
        })
        .catch((err) => {
          console.error("Ei saanud uudiskirja eelistust kätte:", err);
        });
    }
  }, [user?.email]);
  
  const handleNewsletterChange = async (e) => {
    const isChecked = e.target.checked;
    setNewsletter(isChecked);
  
    if (user?.email) {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/api/newsletter`, {
          email: user.email,
          subscribed: isChecked,
        });
        console.log("Uudiskirja eelistus salvestatud");
      } catch (err) {
        console.error("Salvestamine ebaõnnestus:", err);
      }
    }
  };
  

  const toggleOrder = (id) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow">
        {/* TAB MENÜÜ */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            className={`min-w-[120px] px-4 py-2 font-bold rounded-full transition duration-200 ${activeTab === "orders" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}
            onClick={() => setActiveTab("orders")}
          >
            Tellimused
          </button>
          <button
            className={`min-w-[120px] px-4 py-2 font-bold rounded-full transition duration-200 ${activeTab === "recipe" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}
            onClick={() => setActiveTab("recipe")}
          >
            Retseptid
          </button>
          <button
            className={`min-w-[120px] px-4 py-2 font-bold rounded-full transition duration-200 ${activeTab === "settings" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}
            onClick={() => setActiveTab("settings")}
          >
            Seaded
          </button>
        </div>
  
        {/* TELLIMUSED */}
        {activeTab === "orders" && (
          <>
            <h1 className="text-3xl font-bold mb-4">Varasemad tellimused</h1>
            {orders.length === 0 ? (
              <p className="text-black">Sul ei ole veel tellimusi.</p>
            ) : (
              <ul className="space-y-4">
                {orders.map((order) => (
                  <li key={order.id} className="bg-gray-50 p-4 rounded shadow">
                    <div
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleOrder(order.id)}
                    >
                      <div>
                        <p className="font-semibold">
                          Tellitud: {new Date(order.order_date).toLocaleString("et-EE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                        <p>Kokku: {order.total_price} €</p>
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
                            {order.order_items
                              .filter(item => !item.name.toLowerCase().includes("tarne"))
                              .map((item, i) => (
                                <li key={i}>{item.name} x {item.quantity}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
  
        {/* RETSEPT */}
        {activeTab === "recipe" && (
          <div className="text-black space-y-4">
            {/* Pealkiri + toggler */}
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setShowRecipe((prev) => !prev)}
            >
              <h1 className="text-3xl font-bold">Salajane jääkohvi retsept</h1>
              {showRecipe ? <FaChevronUp /> : <FaChevronDown />}
            </div>

            {showRecipe && (
              <div className="space-y-4">
                <p>
                  ☀️ <strong>Kas tunned mõnusal suvehommikul, et tahaks klaasikest värskendavat jääkohvi?</strong><br />
                  Meie retseptiga saad selle <strong>imelihtsalt koduste vahenditega</strong> valmis teha!
                </p>

                <p className="font-semibold">🛒 Sul läheb vaja:</p>
                <ul className="list-disc list-inside">
                  <li>0,5–2 sl <strong>Meemeeste maitsemett šokolaadiga</strong> (võib olla ka muu šokolaadimee variant)</li>
                  <li>2 sl lahustuvat kohvi</li>
                  <li>300 ml piima</li>
                  <li>Jääkuubikuid (soovi korral)</li>
                </ul>

                <p>
                  🧊 <strong>Jääkohv võib tunduda eksootiline ja keeruline,</strong> kuid tegelikult on seda <strong>lihtne teha</strong> ja tulemus on imeline!
                </p>

                <p>
                  🍯 <strong>Miks kasutada just Meemeeste maitsemett?</strong><br />
                  – Suhkru asemel looduslik, tervislik ja maitsvam valik!
                </p>

                <h2 className="text-xl font-semibold mt-6">☕ Kohvisegu valmistamine:</h2>
                <ul className="list-disc list-inside">
                  <li>2 sl lahustuvat kohvi</li>
                  <li>0,5–2 sl šokolaadimett (vastavalt maitse-eelistusele)</li>
                  <li>1 sl pruuni suhkrut (soovi korral – teeb segu kreemisemaks)</li>
                  <li>2 sl leiget vett</li>
                </ul>
                <p>Vispelda või mikserda, kuni tekib kreemjas ja ühtlane kohvisegu.</p>

                <h2 className="text-xl font-semibold mt-6">🥛 Serveerimine:</h2>
                <ul className="list-disc list-inside">
                  <li>Vala klaasi 1/3 piima</li>
                  <li>Lisa kohvisegu ja sega korralikult</li>
                  <li>Viimane piimakiht + vaht klaasi peale</li>
                  <li>Lisa jääkuubikud ❄️ ja <strong>naudi!</strong></li>
                </ul>
              </div>
            )}

            {/* Allaserva lisainfo */}
            <div className="pt-6">
              <p className="text-center text-gray-600 font-medium">
                📢 Hoia silm peal – uued retseptid ilmuvad peagi!
              </p>
            </div>
            {/* Uudiskiri */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="newsletter"
                checked={newsletter}
                onChange={handleNewsletterChange}
                className="mr-2"
              />
              <label htmlFor="newsletter">Soovin liituda uudiskirjaga</label>
            </div>
          </div>
        )}

        {/* SEADED */}
        {activeTab === "settings" && (
          <div className="text-black space-y-6">
            <h1 className="text-3xl font-bold mb-4">Seaded</h1>

            {/* Parooli muutmise link */}
            <div>
              <p className="mb-1">Soovid muuta oma parooli?</p>
              <a
                href="/unustasid-parooli"
                className="text-blue-600 hover:underline font-semibold"
              >
                Saada taastamislink e-postile
              </a>
            </div>

            {/* Logi välja nupp – väiksem ja tagasihoidlikum */}
            <div className="pt-4">
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-red-600 hover:text-red-800 font-medium transition"
              >
                Logi välja
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
