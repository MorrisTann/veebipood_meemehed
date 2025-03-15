import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(formData.email)) {
      setError("Palun sisesta kehtiv e-mail");
      return;
    }
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/register`, formData)
      .then((res) => {
        // Uuendame sõnumit, et konto on loodud, kuid kasutaja peab oma emaili kinnitama
        setSuccess("Registreerimine õnnestus! Palun kontrolli oma emaili ja kinnita oma konto.");
        setError("");
        // Võid siin mitte kohe suunata login lehele, vaid lasta kasutajal ise suhelda
        // Või suunata pärast mõnda aega login lehele:
        setTimeout(() => {
          navigate("/login");
        }, 5000);
      })
      .catch((err) => {
        setError("Registreerimine ebaõnnestus. Proovi uuesti.");
        setSuccess("");
        setTimeout(() => setError(""), 3000);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Registreerimine</h1>
        {success && (
          <p className="text-green-500 text-center mb-4">{success}</p>
        )}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Kasutajanimi:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Parool:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-700 transition duration-300"
          >
            Registreeri
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Konto juba olemas?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Logi sisse
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
