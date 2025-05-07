import React from "react";
import meist1 from "../assets/meist1.jpg";
import meist2 from "../assets/meist2.jpg";

const About = () => {
  return (
    <div className="bg-white">
      {/* Ülemine pilt äärest ääreni */}
      <div className="w-full">
        <img
          src={meist1}
          alt="Meist"
          width={1600}
          height={256}
          loading="eager"
          className="w-full h-64 object-cover"
        />
      </div>

      {/* Ülejäänud sisu keskele ja valge taustaga */}
      <div className="about-content max-w-4xl mx-auto px-6 py-8 bg-white min-h-[600px]">
        <h1 className="text-4xl font-bold text-center mb-6">MEIE LUGU</h1>
        <p className="text-lg text-gray-600 mb-4">
        Meemeeste taga on kolm noormeest Nõo Reaalgümnaasiumist, kes otsustasid teha õpilasfirma. Idee sai alguse 2020. aasta suvel. Algselt oli plaanis avada mobiilne mokteiliputka (mokteil – alkoholivaba kokteil) – pandeemia tõttu loobusime. Otsisime uuesti ideid, jõudsime tagasi kolme aasta taguse ideeni, kui kaks praeguse firma liiget tegid kaheksandas klassis minifirmat ning tootsid erinevaid meevõideid. Tundsime, et ettevõtmine jäi poolikuks, justkui mingi eesmärk jäi saavutamata, seega otsustasime idee taas ellu äratada. Vaatasime vana idee kriitilise pilguga üle ning alustasime ajurünnakutega, otsustasime välja jätta või, et toote säilimisaeg oleks pikem. Teiseks valisime välja tugevamat maitset andvad marjajahud. Tooteid testides panime paberile kirja kõik retseptid ning andsime valminud segu maitsele, konsistentsile ja välimusele hinnangu. Valmistatud tooteid testisid nii meie pereliikmed kui ka sõbrad, samuti püüdsime mõista, milliseid tooteid klient ostaks. Tootetestimisel avastasime, et šokolaadi maitsemeest saab teha kakaojooki – meevõidest sai uudsete kasutusaladega maitsemee.
        </p>

        {/* Teine pilt sisu keskel */}
        <div className="my-8">
          <img
            src={meist2}
            alt="Meeskond"
            width={800}
            height={400}
            className="w-full object-cover rounded"
          />
        </div>

        <h2 className="text-3xl font-bold mb-4 scroll-mt-24">MEESKOND</h2>
        <p className="text-lg text-gray-700 mb-2"><strong>Morris Tann</strong> - Tegevjuht</p>
        <p className="text-lg text-gray-700 mb-2"><strong>Rasmus Susi</strong> - Turundusjuht</p>
        <p className="text-lg text-gray-700 mb-4"><strong>Helmo Oja</strong> - Finantsjuht</p>

        <h2 className="text-3xl font-bold mb-4 scroll-mt-24">TUNNUSTUSED</h2>
        <ul className="list-disc list-inside text-lg text-gray-700 space-y-1">
          <li>Esimene koht Valgamaa Ettevõtluskonkursil "Nupp Nokib" (2021)</li>
          <li>Junior Achievement Eesti virtuaallaadal tiitel "Rahva lemmik" (2021)</li>
          <li>Ettevõtluskonkursil "Välk" TOP 3 (2021)</li>
          <li>JA Eesti PÕF "Parim toiduvaldkonna õpilasfirma"</li>
          <li>JA Eesti PÕF "Kõige kasutajasõbralikum õpilasfirma e-pood"</li>
          <li>Tartumaa aasta toode finalist (2021)</li>
          <li>Wise 20 under 20 finalist (2021)</li>
          <li>Edu ja Tegu "Aasta ettevõtlik õppur" nominent (2021)</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
