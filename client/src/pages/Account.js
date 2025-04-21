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
  const [showRecipe, setShowRecipe] = useState(false);
  const [showOrders, setShowOrders] = useState(true);

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
        <div className="flex justify-between items-center cursor-pointer mb-4" onClick={() => setShowOrders((prev) => !prev)}>
          <h1 className="text-3xl font-bold">Varasemad tellimused</h1>
          {showOrders ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {showOrders && (
          orders.length === 0 ? (
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
                      <p className="font-semibold">Tellitud: {new Date(order.order_date).toLocaleString()}</p>
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
          )
        )}

        <div className="mt-10">
          <div className="flex justify-between items-center cursor-pointer" onClick={() => setShowRecipe(prev => !prev)}>
            <h1 className="text-3xl font-bold">Salajane jääkohvi retsept</h1>
            {showRecipe ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          {showRecipe && (
            <div className="mt-4 text-black space-y-4">
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
                🧊 <strong>Jääkohv võib tunduda eksootiline ja keeruline,</strong> kuid kohe lükkame selle müüdi ümber.
                Tegelikult on seda <strong>üsna lihtne teha</strong> ning see <em>maitseelamus</em> on pärast seda kindlasti väärt!
              </p>

              <p>
                🍯 <strong>Miks kasutada just Meemeeste maitsemett?</strong><br />
                – Tavaliselt tehakse magusat jääkohvi suhkruga, mis <strong>ei ole pooltki nii tervislik</strong> kui mesi!
              </p>

              <h2 className="text-xl font-semibold mt-6">☕ Kohvisegu valmistamine:</h2>
              <p>Pane kaussi:</p>
              <ul className="list-disc list-inside">
                <li>2 sl lahustuvat kohvi</li>
                <li>0,5–2 sl <strong>Meemeeste šokolaadimett</strong> (vastavalt sellele, kui magusat kohvi soovid)</li>
                <li>soovi korral 1 sl pruuni suhkrut (teeb segu veelgi kreemjamaks)</li>
                <li>2 sl leiget vett (et oleks hea vispeldada)</li>
              </ul>
              <p>
                Seejärel <strong>vispelda / sega lusikaga / mikserda</strong> kuniks tekib <strong>kreemjas ja ühtlane tükivaba segu</strong>.
              </p>

              <h2 className="text-xl font-semibold mt-6">🥛 Serveerimine:</h2>
              <ul className="list-disc list-inside">
                <li>Vala klaasi umbes <strong>1/3 piima</strong> – see aitab hoida segu klaasi seintest lahti</li>
                <li>Lisa piimale <strong>kohvisegu</strong> ning sega korralikult</li>
                <li>Et kauss puhtaks saada: vala sinna veidi piima ja vispelda, see <strong>vahukiht</strong> sobib ideaalselt klaasi peale</li>
                <li>Lisa veel piima (vastavalt soovitud kangusele)</li>
                <li>Pane juurde jääkuubikud ❄️ ja <strong>naudi!</strong></li>
              </ul>
            </div>
          )}
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-bold mb-2">Hoia silma peal, uued retseptid ilmuvad peagi!</h2>

          <div className="flex items-center">
          <input
            type="checkbox"
            id="newsletter"
            checked={newsletter}
            onChange={handleNewsletterChange}
            className="mr-2"
          />
            <label htmlFor="newsletter" className="text-black">
              Soovin liituda uudiskirjaga
            </label>
          </div>
        </div>

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

export default Account;
