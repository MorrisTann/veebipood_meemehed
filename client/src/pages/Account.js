import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Account = () => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return (
      <p className="text-center text-gray-600 mt-10">Laen andmeid...</p>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-6">
          Tere, {user.username}!
        </h1>
        <p className="text-gray-700 mb-8">
          See on kaitstud leht, nähtav ainult sisselogitud kasutajatele.
        </p>
        <button
          onClick={logout}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition duration-300 font-bold"
        >
          Logi välja
        </button>
      </div>
    </div>
  );
};

export default Account;
