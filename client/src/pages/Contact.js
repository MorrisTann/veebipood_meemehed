import React from "react";

const Contact = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Kontaktid</h1>
        <div className="space-y-6">
          {/* Aadressi info */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Aadress</h2>
            <p className="text-gray-700">Tammesalu, Kirbu küla</p>
            <p className="text-gray-700">Valga vald, Valgamaa</p>
            <p className="text-gray-700">Eesti, EL</p>
            <p className="text-gray-700">Registrikood: 16287618</p>
          </div>
          {/* Kontaktandmed */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Kontakt</h2>
            <p className="text-gray-700"><strong>Telefon:</strong> +372 5699 2860</p>
            <p className="text-gray-700"><strong>E-mail:</strong> meemehed@gmail.com</p>
            <p className="text-gray-700"><strong>Facebook:</strong> Meemehed</p>
            <p className="text-gray-700"><strong>Instagram:</strong> Meemehed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
