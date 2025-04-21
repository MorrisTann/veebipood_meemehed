import React from "react";
import teeTooted from "../assets/tee_tooted.jpg";
import vürtsikadTooted from "../assets/vürtsikad_tooted.jpg";
import šokoTooted from "../assets/šoko_tooted.jpg";

const AboutProducts = () => {
  return (
    <div className="bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Meie Maitsemeed</h1>
        <p className="text-lg text-gray-700 mb-6">
          Toodete põhikomponendiks on mesi, mis on pärit Valgamaalt. Tooted jagunevad kasutusalade ja komponentide põhjal kolme gruppi.
        </p>

        <h2 className="text-3xl font-semibold mt-8 mb-4">Šokolaadimaitsemeed:</h2>
        <p className="text-lg text-gray-700 mb-4">
          Kui lisame meele tumedat šokolaadi ja vastavat koostisosa, saame tulemuseks šokolaadimaitselise maitsemee, mis kuulub meie toodete esimesse gruppi. Need sobivad määrdeks näiteks soojadele pannkookidele või röstsaiadele. Neist saab valmistada ka uudseid, maitsvaid ning tervislikke kakaojooke. Selles viimases peitubki meie toote peamine uuenduslikkus.
        </p>
        <img src={šokoTooted} alt="Šokolaadimaitsemeed" className="w-2/3 mx-auto rounded mb-8 shadow" />

        <h2 className="text-3xl font-semibold mt-8 mb-4">Teega seotud maitsemeed:</h2>
        <p className="text-lg text-gray-700 mb-4">
          Tee valmistamiseks tuleb lahustada maitsemesi kuumas vees. Nendest kaks, maasika-jõhvika maitsemesi ning astelpaju maitsemesi on mõeldud tee sisse segamiseks, et teele mõnusalt magus marjamaitse lisada. Need maitsemeed on toodetud marjajahust ja meest. Siia gruppi kuulub ka piparmündi maitsemesi, mis on mõeldud klassikalise piparmündi tee valmistamiseks. See koosneb meest ja ise kuivatatud ning jahvatatud piparmündist. Nagu ka šokolaadi maitsemeed, sobivad ka kõik need eelnimetatud maitsemeed sooja pannkoogi või röstsaiaga.
        </p>
        <img src={teeTooted} alt="Teega seotud maitsemeed" className="w-2/3 mx-auto rounded mb-8 shadow" />

        <h2 className="text-3xl font-semibold mt-8 mb-4">Vürtsikad maitsemeed:</h2>
        <p className="text-lg text-gray-700 mb-4">
          Kolmandasse gruppi kuulub hetkel vaid üks vürtsikas toode, kuid plaanime tootearendust teha ning seda gruppi täiendada. Vürtsikaks maitsemeeks on ürdi-pipra maitsemesi, mis teeb kokandushuviliste elu lihtsamaks ja huvitavamaks. See koosneb meest ja erinevatest ürtidest ning on mõeldud ahjuliha marineerimiseks ja küpsetamiseks. Kui tavaliselt tuleb ise liha marineerides või maitsestades kõik komponendid eraldi lisada, siis nüüd saab vaid lisada ürdi-pipra maitsemee, kus on juba ürdid ja sool sees. Mesi seob kõik need komponendid omavahel ja aitab neil liha sisse imbuda. Lisaks sellele annab mesi lihale ka mõnusa magusa-vürtsika maitse. Kõik, mida lihaarmastaja tegema peab, et liha maitsestada, on maitsemee kandmine lihale.
        </p>
        <img src={vürtsikadTooted} alt="Vürtsikad maitsemeed" className="w-2/3 mx-auto rounded shadow" />
      </div>
    </div>
  );
};

export default AboutProducts;