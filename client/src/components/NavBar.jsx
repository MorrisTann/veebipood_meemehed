import React, { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";

const NavBar = () => {
  const { cart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center relative">
        <div className="text-3xl font-bold text-black hover:text-amber-600 transition px-2 py-1">
          <Link 
          to="/">Avaleht</Link>
        </div>

        <div className="lg:hidden">
          <button
            className="text-black focus:outline-none hover:text-amber-600 transition px-2 py-1"
            onClick={toggleMenu}
          >
            {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>

        <div
          ref={menuRef}
          className={`absolute top-full right-4 mt-2 bg-white shadow-md rounded-md py-2 px-4 flex flex-col space-y-2 lg:hidden z-50 transform transition-all duration-300 ${
            isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          {navLinks(user, totalItems)}
        </div>

        <div className="hidden lg:flex lg:items-center lg:space-x-6 text-black">
          {navLinks(user, totalItems)}
        </div>
      </div>
    </nav>
  );
};

const navLinks = (user, totalItems) => (
  <>
    <Link to="/pood" className="font-bold hover:text-amber-600 transition px-2 py-1">Pood</Link>
    <Link to="/toode" className="font-bold hover:text-amber-600 transition px-2 py-1">Toode</Link>
    <Link to="/meist" className="font-bold hover:text-amber-600 transition px-2 py-1">Meist</Link>
    {user ? (
      <Link to="/konto" className="font-bold hover:text-amber-600 transition px-2 py-1">Minu Konto</Link>
    ) : (
      <Link to="/login" className="font-bold hover:text-amber-600 transition px-2 py-1">Logi sisse</Link>
    )}
    <Link to="/ostukorv" className="font-bold hover:text-amber-600 transition px-2 py-1">
      <div className="relative w-6 h-6">
        <FaShoppingCart className="w-full h-full" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-amber-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
            {totalItems}
          </span>
        )}
      </div>
    </Link>
  </>
);

export default NavBar;
