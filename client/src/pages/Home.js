import React from "react";
import { Link } from "react-router-dom";
import avalehefoto from "../assets/avalehefoto.jpg";

const Home = () => {
  return (
    <div className="relative h-full w-full overflow-x-hidden">
      {/* Taustapilt */}
      <img
        src={avalehefoto}
        alt="Meemehed"
        className="absolute inset-0 w-full h-full object-cover brightness-90"
      />

      {/* Tekstikast + läbipaistev kiht */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white drop-shadow-md tracking-wide break-words">
          MEEMEHED
        </h1>
        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-white mt-4 break-words">
          KVALITEETSED JA UUDSED MAITSEMEED
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-white max-w-md sm:max-w-xl mt-4 break-words">
          Valmistamisel on kasutatud Lõuna-Eestis korjatud Saavaste &amp; Loos mett. 
          Kõik tooted on valmistatud käsitööna ning rohke armastusega. Tootevalik on väga lai ja kõigil on palju kasutusalasid: 
          määri saiale, pane pannakale, tee kakaod, sega tee sisse või hoopis marineeri liha – leia omale sobiv!
        </p>

        <Link
          to="/pood"
          className="mt-8 bg-white text-black px-6 py-3 rounded-full shadow-lg hover:bg-gray-200 transition duration-300 text-base sm:text-lg font-semibold"
        >
          Vaata tooteid
        </Link>
      </div>
    </div>
  );
};

export default Home;
