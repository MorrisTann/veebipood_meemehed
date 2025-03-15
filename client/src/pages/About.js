import React from "react";
import meist1 from "../assets/meist1.jpg";
import meist2 from "../assets/meist2.jpg";

const About = () => {
  return (
    <div className="bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Esimene pilt konteineri sees */}
        <img
          src={meist1}
          alt="Meist"
          className="w-full h-64 object-cover"
        />
        <div className="px-6 py-8">
          <h1 className="text-4xl font-bold text-center mb-6">MEIE LUGU</h1>
          <p className="text-lg text-gray-700 mb-4">
            Meemeeste taga on kolm noormeest Nõo Reaalgümnaasiumist, kes otsustasid teha õpilasfirma. Idee sai alguse 2020. aasta suvel. Algselt oli plaanis avada mobiilne mokteiliputka (mokteil – alkoholivaba kokteil) – pandeemia tõttu loobusime. Otsisime uuesti ideid, jõudsime tagasi kolme aasta taguse ideeni, kui kaks praeguse firma liiget tegid kaheksandas klassis minifirmat ning tootsid erinevaid meevõideid. Tundsime, et ettevõtmine jäi poolikuks, justkui mingi eesmärk jäi saavutamata, seega otsustasime idee taas ellu äratada. Vaatasime vana idee kriitilise pilguga üle ning alustasime ajurünnakutega, otsustasime välja jätta või, et toote säilimisaeg oleks pikem. Teiseks valisime välja tugevamat maitset andvad marjajahud. Tooteid testides panime paberile kirja kõik retseptid ning andsime valminud segu maitsele, konsistentsile ja välimusele hinnangu. Valmistatud tooteid testisid nii meie pereliikmed kui ka sõbrad, samuti püüdsime mõista, milliseid tooteid klient ostaks. Tootetestimisel avastasime, et šokolaadi maitsemeest saab teha kakaojooki – meevõidest sai uudsete kasutusaladega maitsemee.
          </p>
          
          {/* Teine pilt, mis asub sisu keskel */}
          <div className="my-8">
            <img
              src={meist2}
              alt="Meeskond"
              className="w-full object-cover rounded"
            />
          </div>
          
          <h2 className="text-3xl font-bold mb-4">NÜÜDSEKS</h2>
          <p className="text-lg text-gray-700 mb-4">
            Nüüdseks on õpilasfirmast saanud osaühing ning jätkame maitsemee tootmise ja müümisega. Kahjuks ei saanud ettevõtte nimeks OÜ Meemehed, sest tuleb välja, et on olemas juba liiga ligilähedane nimi – OÜ Meemees. Seega otsustasime, et ettevõtte nimeks saab Maitsemesi OÜ, vaatamata sellele jätkame siiski meemeeste brändiga.
          </p>
          
          <h2 className="text-3xl font-bold mb-4">MEESKOND</h2>
          <p className="text-lg text-gray-700 mb-2">
            <strong>Morris Tann</strong> - Tegevjuht
          </p>
          <p className="text-lg text-gray-700 mb-4">
            <strong>Rasmus Susi</strong> - Turundusjuht
          </p>
          <p className="text-lg text-gray-700 mb-4">
            <strong>Helmo Oja</strong> - Finantsjuht
          </p>
          
          <h2 className="text-3xl font-bold mb-4">TUNNUSTUSED</h2>
          <ul className="list-disc list-inside text-lg text-gray-700">
            <li>Esimene koht Valgamaa Ettevõtluskonkursil "Nupp Nokib" (2021)</li>
            <li>Junior Achievement Eesti virtuaallaadal tiitel "Rahva lemmik" (2021)</li>
            <li>Ettevõtluskonkursil "Välk" TOP 3 (2021)</li>
            <li>Junior Achievement Eesti PÕF 2021 "Parim toiduvaldkonna õpilasfirma"</li>
            <li>Junior Achievement Eesti PÕF 2021 "Kõige kasutajasõbralikum õpilasfirma e-pood"</li>
            <li>Tartumaa aasta toode finalist (2021)</li>
            <li>Wise 20 under 20 finalist (2021)</li>
            <li>Edu ja Tegu "Aasta ettevõtlik õppur" nominent (2021)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
