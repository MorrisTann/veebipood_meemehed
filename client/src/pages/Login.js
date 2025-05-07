import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";
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
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("confirmed") === "true") {
      setSuccess("Konto kinnitamine õnnestus. Saate nüüd sisse logida.");
    }
    if (params.get("reset") === "success") {
      setSuccess("Parool on edukalt muudetud. Saate nüüd sisse logida.");
    }
  }, [location.search]);

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/login`, {
        email: formData.email,
        password: formData.password,
      })
      .then((res) => {
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        login(user);

        setSuccess("Sisselogimine õnnestus!");
        setError("");
        setTimeout(() => {
          if (user.email === "meemehed.kinnitus@gmail.com") {
            navigate("/admin");
          } else {
            navigate("/konto");
          }
        }, 1500);
      })
      .catch((err) => {
        const status = err.response?.status;
        const errorMessage = err.response?.data?.error;

        if (status === 429) {
          setError(errorMessage || "Liiga palju sisselogimiskatseid. Proovi uuesti hiljem.");
        } else if (errorMessage && errorMessage.toLowerCase().includes("kinnita")) {
          setError("Palun kinnita oma Gmail! Kontrolli oma e-posti ja kinnita oma konto.");
        } else {
          setError("Vale e-mail või parool. Proovi uuesti.");
        }

        setSuccess("");
      });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 px-4 py-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Logi sisse</h1>
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              E-mail või kasutajanimi:
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1">
              Parool:
            </label>
            <input
              type="password"
              id="password"
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
          <Link to="/register" className="text-blue-700 font-semibold hover:underline">
            Registreeru siin
          </Link>
        </p>
        <p className="mt-6 text-center text-gray-600">
          <Link to="/unustasid-parooli" className="text-blue-700 font-semibold hover:underline">
            Unustasid parooli?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
