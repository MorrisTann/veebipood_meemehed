import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // <- uus olek

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/protected`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const isAdmin = res.data.email === "meemehed.kinnitus@gmail.com";
          setUser({ ...res.data, isAdmin });
        })
        .catch(() => {
          setUser(null);
        })
        .finally(() => {
          setLoading(false); // <- lõpeta ootamine
        });
    } else {
      setUser(null);
      setLoading(false); // <- pole tokenit, valmis kohe
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
