import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import countries from "i18n-iso-countries";
import enCountries from "i18n-iso-countries/langs/en.json";
import { FaArrowLeft } from "react-icons/fa";
import { useMemo } from "react";

countries.registerLocale(enCountries);
const stripePromise = loadStripe("pk_test_51R8f5LBDDdfeITM8zet4lsmUPU6NypWq0XP6v8uqkxGC2THEA8uMHWvuXEtu6pWogZMicnvhI2xctdopDKUmVAun00chQDrZ4g");

const Payment = () => {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    company: "",
    vat: "",
    address1: "",
    address2: "",
    city: "",
    country: "EE",
    postalCode: "",
    shippingMethod: "",
    pickupLocation: "",
    terminalName: "",
    agreed: false,
  });

  const [countriesList, setCountriesList] = useState([]);

  const productTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);
  
  const shippingCost = useMemo(() => {
    switch (form.shippingMethod) {
      case "dpd":
        return 4.40
      case "omniva":
        return 3.45
      case "itella":
        return 3.49;
      default:
        return 0;
    }
  }, [form.shippingMethod]);
  
  const grandTotal = useMemo(() => productTotal + shippingCost, [productTotal, shippingCost]);

  useEffect(() => {
    setCountriesList(Object.entries(countries.getNames("en", { select: "official" })));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit käivitati");
  
    if (!form.email || !form.name || !form.phone || !form.agreed) {
      alert("Palun täida kõik kohustuslikud väljad ja nõustu tingimustega.");
      return;
    }
  
    let shippingCost = 0;
    switch (form.shippingMethod) {
      case "dpd":
        shippingCost = 4.40;
        break;
      case "omniva":
        shippingCost = 3.45;
        break;
      case "itella":
        shippingCost = 3.49;
        break;
      case "pickup":
      default:
        shippingCost = 0;
        break;
    }
  
    const stripe = await stripePromise;
    const token = localStorage.getItem("token");
  
    const itemsWithShipping = [
      ...cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
      })),
      ...(shippingCost > 0
        ? [{
            name: "Tarne (" + form.shippingMethod.toUpperCase() + ")",
            price: shippingCost,
            quantity: 1,
          }]
        : []),
    ];
  
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        items: itemsWithShipping,
        customer: form,
      }),
    });
  
    const data = await response.json();
    if (response.ok && data.url) {
      console.log("Salvestan ostukorvi enne redirecti:", cart);
      localStorage.setItem("cart", JSON.stringify(cart));
      window.location.href = data.url;
    } else if (response.status === 400 && data.error) {
      alert(`Viga: ${data.error}`);
    } else {
      alert("Makse alustamine ebaõnnestus.");
    }

  };
  

  return (
    <div className="max-w-3xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <button
          onClick={() => navigate("/ostukorv")}
          className="flex items-center text-black hover:text-amber-600 mb-4 transition"
        >
          <FaArrowLeft className="mr-2" />
          Tagasi ostukorvi
        </button>
      <h1 className="text-3xl font-bold mb-6 text-center">Telli ja maksa</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input name="email" type="email" required placeholder="E-mail*" value={form.email} onChange={handleChange} className="border p-2 rounded w-full" />
          <input name="name" required placeholder="Nimi*" value={form.name} onChange={handleChange} className="border p-2 rounded w-full" />
          <input name="phone" required placeholder="Telefon*" value={form.phone} onChange={handleChange} className="border p-2 rounded w-full" />
          <input name="company" placeholder="Ettevõte" value={form.company} onChange={handleChange} className="border p-2 rounded w-full" />
          <input name="vat" placeholder="KMKR number" value={form.vat} onChange={handleChange} className="border p-2 rounded w-full" />
          <input name="address1" placeholder="Aadress" value={form.address1} onChange={handleChange} className="border p-2 rounded w-full" />
          <input name="address2" placeholder="Aadressi rida 2" value={form.address2} onChange={handleChange} className="border p-2 rounded w-full" />
          <input name="city" placeholder="Linn" value={form.city} onChange={handleChange} className="border p-2 rounded w-full" />
          <select name="country" value={form.country} onChange={handleChange} className="border p-2 rounded w-full">
            {countriesList.map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
          <input name="postalCode" placeholder="Postiindeks" value={form.postalCode} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="block font-semibold">Tarneviis*</label>
          <select name="shippingMethod" required value={form.shippingMethod} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="">-- Vali tarneviis --</option>
            <option value="dpd">DPD pakiautomaat - 4.40€</option>
            <option value="omniva">Omniva pakiautomaat - 3.45€</option>
            <option value="itella">Itella Smartpost - 3.49€</option>
            <option value="pickup">Tulen ise järele - Tasuta</option>
          </select>
        </div>

        {(form.shippingMethod === "dpd" || form.shippingMethod === "omniva" || form.shippingMethod === "itella") && (
          <div>
            <label className="block font-semibold">Pakiautomaadi nimi*</label>
            <input
              name="terminalName"
              required
              placeholder="Nt. Elva Maxima X"
              value={form.terminalName}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
        )}

        {form.shippingMethod === "pickup" && (
          <div>
            <label className="block font-semibold">Asukoht</label>
            <select name="pickupLocation" value={form.pickupLocation} onChange={handleChange} className="border p-2 rounded w-full">
              <option value="">-- Vali asukoht --</option>
              <option value="valga">Valga – Tulbi 2</option>
              <option value="tartu">Tartu – Turu 13</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">Võtame teiega ühendust, kui kaup on valmis.</p>
          </div>
        )}

        <div className="flex items-center">
          <input type="checkbox" name="agreed" checked={form.agreed} onChange={handleChange} className="mr-2" required />
          <label htmlFor="agreed">Nõustun <a href="/muugi-ja-tagastustingimused" className="text-blue-600 underline">üld- ja tagasimaksmise tingimustega</a></label>
        </div>
        <div className="mt-6 bg-gray-50 p-4 rounded shadow text-gray-800">
          <h3 className="font-semibold text-lg mb-2">Tellimuse kokkuvõte</h3>
          <p>Tooteid kokku: {cart.reduce((sum, i) => sum + i.quantity, 0)} tk</p>
          <p>Toodete hind: {productTotal.toFixed(2)} €</p>
          <p>Tarne hind: {shippingCost.toFixed(2)} €</p>
          <hr className="my-2" />
          <p className="font-bold text-xl">Kokku: {grandTotal.toFixed(2)} €</p>
        </div>
        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full w-full mt-4">
          Jätka maksmisega
        </button>
      </form>
    </div>
  );
};

export default Payment;
