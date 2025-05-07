import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import avalehefoto from "../assets/avalehefoto.jpg";

const Home = () => {
  useEffect(() => {
    document.body.classList.add("overflow-hidden");

    const preventScroll = (e) => {
      e.preventDefault();
    };

    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.body.classList.remove("overflow-hidden");
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Taustapilt */}
      <img
        src={avalehefoto}
        alt="Meemehed brändi avalehe taustapilt"
        fetchpriority="high"
        className="fixed inset-0 w-full h-full object-cover"
      />

      {/* Läbipaistev tume kiht */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent"></div>

      {/* Tekstikast */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center w-full h-screen px-6">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white drop-shadow-lg tracking-wide mb-2 animate-fade-in delay-[200ms] fill-mode-both">
          MEEMEHED
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mt-4 animate-fade-in delay-[600ms] fill-mode-both">
          KVALITEETSED JA INNOVAATILISED MAITSEMEED
        </h2>

        {/* Sotsiaalmeedia ikoonid */}
        <div className="flex space-x-6 mt-8 animate-fade-in delay-[1000ms] fill-mode-both">
          <a
            href="https://www.facebook.com/Meemehed"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Meemehed Facebookis"
            className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-400 transition duration-300"
          >
            <FaFacebookF className="text-black text-2xl" />
          </a>
          <a
            href="https://www.instagram.com/Meemehed"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Meemehed Instagramis"
            className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-400 transition duration-300"
          >
            <FaInstagram className="text-black text-2xl" />
          </a>
        </div>

        {/* Vaata tooteid nupp */}
        <Link
          to="/pood"
          className="mt-8 animate-fade-in delay-[1400ms]"
          aria-label="Vaata tooteid"
        >
          <span className="bg-white text-black font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-gray-400 transition duration-300">
            Vaata tooteid
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Home;
