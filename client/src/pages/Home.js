import React from "react";
import { Link } from "react-router-dom";
import avalehefoto from "../assets/avalehefoto.jpg";

const Home = () => {
  return (
    // h-full ja w-full täidavad vanema (App.js-i <div className="flex-1">) ruumi
    <div className="relative h-full w-full">
      {/* Taustapilt katab täies ulatuses */}
      <img
        src={avalehefoto}
        alt="Meemehed"
        className="absolute inset-0 w-full h-full object-cover brightness-90"
      />

      {/* Must läbipaistev kiht teksti paremaks loetavuseks */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-7xl font-extrabold text-white drop-shadow-lg tracking-wider">
          MEEMEHED
        </h1>
        <h2 className="text-4xl font-bold text-white mt-4">
          KVALITEETSED JA UUDSED MAITSEMEED
        </h2>
        <p className="text-lg text-white max-w-2xl mt-4">
          Valmistamisel on kasutatud Lõuna-Eestis korjatud Saavaste &amp; Loos mett. 
          Kõik tooted on valmistatud käsitööna ning rohke armastusega. Tootevalik on väga lai ja kõigil on palju kasutusalasid: 
          määri saiale, pane pannakale, tee kakaod, sega tee sisse või hoopis marineeri liha – leia omale sobiv!
        </p>

        {/* "Vaata tooteid" nupp */}
        <Link
          to="/tooted"
          className="mt-8 bg-white text-black px-6 py-3 rounded-full shadow-lg hover:bg-gray-200 transition duration-300 text-lg font-semibold"
        >
          Vaata tooteid
        </Link>
      </div>
    </div>
  );
};

export default Home;
