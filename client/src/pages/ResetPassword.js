import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Paroolid ei kattu.");
      return;
    }
    if (password.length < 8 || password.length > 64 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError("Parool peab olema 8-64 tähemärki pikk, sisaldama suurt tähte ja numbrit.");
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/reset-password`, { token, password });
      setSuccess("Parool edukalt muudetud! Saate nüüd sisse logida.");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError("Link on kehtetu või aegunud.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 px-4 py-20">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Muuda parooli</h1>
        {success && <p className="text-green-600 text-center mb-4">{success}</p>}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Uus parool:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Korda parooli:</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-700 transition"
          >
            Muuda parool
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
