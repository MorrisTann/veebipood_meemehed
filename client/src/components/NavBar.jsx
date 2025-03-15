import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
// Impordi soovitud ikoon, näiteks Font Awesome ostukorv
import { FaShoppingCart } from "react-icons/fa";

const NavBar = () => {
  const { cart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-3xl font-bold text-gray-700">
          <Link to="/">Avaleht</Link>
        </div>

        {/* Hamburger Menu Button (Mobiilivaates) */}
        <button
          className="block lg:hidden text-gray-700 focus:outline-none"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>

        {/* Nav Lingid */}
        <div
          className={`lg:flex lg:items-center lg:space-x-6 text-gray-700 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <Link
            to="/tooted"
            className="block mt-4 lg:inline-block lg:mt-0 font-bold hover:text-amber-600 transition duration-300 px-2 py-1"
          >
            Tooted
          </Link>
          <Link
            to="/meist"
            className="block mt-4 lg:inline-block lg:mt-0 font-bold hover:text-amber-600 transition duration-300 px-2 py-1"
          >
            Meist
          </Link>
          <Link
            to="/kontaktid"
            className="block mt-4 lg:inline-block lg:mt-0 font-bold hover:text-amber-600 transition duration-300 px-2 py-1"
          >
            Kontaktid
          </Link>
          {user ? (
            <Link
              to="/konto"
              className="block mt-4 lg:inline-block lg:mt-0 font-bold hover:text-amber-600 transition duration-300 px-2 py-1"
            >
              Minu Konto
            </Link>
          ) : (
            <Link
              to="/login"
              className="block mt-4 lg:inline-block lg:mt-0 font-bold hover:text-amber-600 transition duration-300 px-2 py-1"
            >
              Logi sisse
            </Link>
          )}
          <Link
            to="/ostukorv"
            className="relative block mt-4 lg:inline-block lg:mt-0 font-bold hover:text-amber-600 transition duration-300 px-2 py-1"
          >
            <FaShoppingCart className="inline-block h-6 w-6" />
            {totalItems > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                {totalItems}
              </span>
            )}
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default NavBar;
