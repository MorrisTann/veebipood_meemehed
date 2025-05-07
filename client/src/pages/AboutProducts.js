import React from "react";
// If using Next.js, import the Image component
// import Image from 'next/image';

import teeTooted from '../assets/tee_tooted.jpg';
import vurtsikadTooted from '../assets/vürtsikad_tooted.jpg';
import sokoTooted from '../assets/šoko_tooted.jpg';

const AboutProducts = () => {
  return (
    <div className="bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Meie Maitsemeed</h1>
        <p className="text-lg text-gray-700 mb-6">
        Meie toodete põhikomponendiks on puhas ja kvaliteetne mesi, mis pärineb Valgamaal asuvast ettevõttest Saavaste ja Loos. Tooted on jaotatud kolme gruppi vastavalt kasutusotstarbele ja lisatud koostisosadele, et pakkuda midagi igale maitsele!.
        </p>

        <section className="mt-8">
          <h2 className="text-3xl font-semibold mb-4">Šokolaadimaitsemeed:</h2>
          <p className="text-lg text-gray-700 mb-4">
          Kui lisame meie meele tumedat šokolaadi ja hoolikalt valitud koostisosi, sünnib rikkalik šokolaadimaitseline maitsemesi – meie tootevaliku esimese grupi tõeline staar. See delikatess sobib ideaalselt määrimiseks soojadele pannkookidele, krõbedale röstsaiale või nautimiseks niisama lusikaga. Veelgi enam – sellest saab valmistada uudseid, maitsvaid ja tervislikke kakaojooke. Just siin avaldubki meie toote kõige olulisem uuenduslikkus – looduslik alternatiiv šokolaadijoogile, ilma lisatud suhkruta.
          </p>
          {/* Use width and height to prevent layout shifts and lazy load */}
          <img
            src={sokoTooted}
            alt="Šokolaadimaitsemeed"
            className="w-full max-w-2xl mx-auto rounded mb-8 shadow"
            width={1209}
            height={892}
            loading="lazy"
            decoding="async"
          />
        </section>

        <section className="mt-8">
          <h2 className="text-3xl font-semibold mb-4">Teega seotud maitsemeed:</h2>
          <p className="text-lg text-gray-700 mb-4">
          Tee valmistamine pole kunagi olnud nii lihtne ja maitsev – piisab vaid sellest, kui segada maitsemesi kuuma vee sisse. Meie maasika-jõhvika ning astelpaju maitsemeed on loodud just selleks, et rikastada teed mõnusa, magusa marjamaitsega. Need meed valmivad kvaliteetsest meest ja looduslikust marjajahust. Samasse gruppi kuulub ka piparmündi maitsemesi, mis on valmistatud meest ning käsitsi kuivatatud ja jahvatatud piparmündist – ideaalne klassikalise piparmünditee valmistamiseks. Nagu ka šokolaadimaitselised variandid, sobivad need meed suurepäraselt määrimiseks pannkookidele või röstsaiale, pakkudes mitmekülgset ja looduslähedast maitseelamust.
          </p>
          <img
            src={teeTooted}
            alt="Teega seotud maitsemeed"
            className="w-full max-w-2xl mx-auto rounded mb-8 shadow"
            width={600}
            height={470}
            loading="lazy"
            decoding="async"
          />
        </section>

        <section className="mt-8">
          <h2 className="text-3xl font-semibold mb-4">Vürtsikad maitsemeed:</h2>
          <p className="text-lg text-gray-700 mb-4">
          Kolmandasse tootegruppi kuulub hetkel üks eriline ja vürtsikas uudistoode – ürdi-pipra maitsemesi, kuid plaanime lähitulevikus seda gruppi täiendada. See maitserikas mesi on loodud just kokandushuvilistele, kes hindavad lihtsust ja maitset. Ürdi-pipra maitsemesi koosneb hoolikalt valitud meest ja ürtidest ning sobib suurepäraselt ahjuliha marineerimiseks ja küpsetamiseks. Kui tavaliselt tuleb kõik maitseained ise kokku segada, siis nüüd piisab vaid ühest komponendist – maitsemeest, milles on juba ürdid ja sool olemas. Mesi seob kõik maitsed ühtseks tervikuks ning aitab neil liha sisse imbuda, andes tulemuseks hõrgu, magus-vürtsika maitsega roa.
          </p>
          <img
            src={vurtsikadTooted}
            alt="Vürtsikad maitsemeed"
            className="w-full max-w-2xl mx-auto rounded shadow"
            width={607}
            height={422}
            loading="lazy"
            decoding="async"
          />
        </section>
      </div>
    </div>
  );
};

export default AboutProducts;
