import React from 'react';
import { FiExternalLink } from 'react-icons/fi';

const schemes = [
  { title: "PM-Kisan Samman Nidhi", url: "https://pmkisan.gov.in" },
  { title: "Agriculture Infrastructure Fund", url: "https://www.pib.gov.in/PressNoteDetails.aspx?NoteId=152061&ModuleId=3" },
  { title: "ATMA (Agricultural Technology Management Agency)", url: "https://atma.gujarat.gov.in" },
  { title: "AGMARKNET", url: "https://agmarknet.gov.in/OtherPages/aboutus.aspx" },
  { title: "Horticulture (MIDH)", url: "https://www.nhb.gov.in" },
  { title: "Online Pesticide Registration", url: "https://agriwelfare.gov.in/Documents/Pesticides_Registration.pdf" },
  { title: "Plant Quarantine Clearance", url: "https://plantauthority.gov.in/public-notice-05-2022-submission-plant-quarantine-clearance-applicants-registration-exotic" },
  { title: "DBT in Agriculture", url: "https://www.fert.nic.in/dbt" },
  { title: "Pradhanmantri Krishi Sinchayee Yojana", url: "https://pmksy.gov.in/" },
  { title: "Kisan Call Center", url: "https://mkisan.gov.in/" },
  { title: "mKisan", url: "https://mkisan.gov.in/" },
  { title: "Jaivik Kheti", url: "https://www.jaivikkheti.in/" },
  { title: "e-Nam", url: "https://enam.gov.in/web/" },
  { title: "Pradhan Mantri Fasal Bima Yojana", url: "https://pmfby.gov.in/" }
];

const GovernmentSchemes = () => {
  const handleRedirect = () => {
    window.open('https://agriwelfare.gov.in/en/Major', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-100 to-teal-100 py-16 px-2">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-green-800 text-center mb-3 tracking-tight">
          Major Government Schemes
        </h1>
        <p className="text-lg text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          Explore top national agricultural schemes that empower Indian farmers. Tap a card to view more on each official portal.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {schemes.map((scheme, i) => (
            <a
              key={scheme.title}
              href={scheme.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative group bg-white shadow-xl border border-green-400 hover:border-green-500 rounded-2xl p-6 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] hover:bg-gradient-to-tr hover:from-emerald-100 hover:to-green-50"
            >
              <div className="h-12 w-12 flex-shrink-0 rounded-sm bg-emerald-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {i + 1}
              </div>
              <div>
                <div className="text-lg font-semibold text-green-900 flex items-center gap-2 mb-1 group-hover:text-emerald-700 transition-colors">
                  {scheme.title}
                  <FiExternalLink className="ml-1 text-green-400 group-hover:text-emerald-900 " />
                </div>
                <div className="text-xs text-gray-500 hidden md:block">
                  Official government portal
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <button
            onClick={handleRedirect}
            className="inline-flex items-center gap-3 px-8 py-3 rounded-xl text-white font-semibold text-lg bg-gradient-to-tr from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-xl hover:scale-105 transition"
          >
            View All Schemes on Govt. Portal
            <FiExternalLink />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GovernmentSchemes;

