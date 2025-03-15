import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Kontrollime, kas token on olemas ja püüame selle abil kasutaja andmed laadida
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/protected`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, []);

  // login funktsioon, mis saadab emaili ja parooli serverisse
  const login = (email, password) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${process.env.REACT_APP_API_URL}/api/login`, { email, password })
        .then((res) => {
          localStorage.setItem("token", res.data.token);
          // Kui server tagastas ainult tokeni, võid vajadusel teha täiendava päringu kasutaja andmete saamiseks.
          // Siin eeldame, et server annab tokeni peale sisselogimist vastuseks kasutaja andmed.
          setUser(res.data);
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
