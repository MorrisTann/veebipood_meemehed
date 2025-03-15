import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData.email, formData.password)
      .then(() => {
        setSuccess("Sisselogimine õnnestus!");
        setError("");
        setTimeout(() => {
          navigate("/konto");
        }, 2000);
      })
      .catch((err) => {
        // Kui server tagastab veateate, mis sisaldab "kinnita"
        const errorMessage = err.response && err.response.data && err.response.data.error;
        if (errorMessage && errorMessage.toLowerCase().includes("kinnita")) {
          setError("Palun kinnita oma Gmail! Kontrolli oma e-posti ja kinnita oma konto.");
        } else {
          setError("Vale e-mail või parool. Proovi uuesti.");
        }
        setSuccess("");
        //setTimeout(() => setError(""), 3000);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Logi sisse</h1>
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            Logi sisse
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Pole veel kontot?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Registreeru siin
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
