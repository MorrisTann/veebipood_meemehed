import React from "react";

const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen text-center px-4">
      <div>
        <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Lehte ei leitud</h2>
        <p className="text-gray-600">Vabandame, aga sellist lehte ei eksisteeri.</p>
      </div>
    </div>
  );
};

export default NotFound;
