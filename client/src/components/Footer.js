import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaPhone, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  const location = useLocation();
  if (location.pathname === "/") return null;

  return (
    <footer className="bg-white text-black py-4 border-t text-sm">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><FaEnvelope /> meemehed@gmail.com</span>
          <span className="flex items-center gap-1"><FaPhone /> +372 5699 2860</span>
        </div>
        <div className="flex gap-4 mt-2 sm:mt-0">
          <Link to="/muugi-ja-tagastustingimused" className="hover:text-amber-600 transition">Müügi- ja tagastustingimused</Link>
        </div>
      </div>
    </footer>

  );
};

export default Footer;