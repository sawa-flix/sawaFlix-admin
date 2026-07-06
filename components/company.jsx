import React from "react";

const companies = [
  {
    id: 1,
    name: "Warner Bros",
    logo: "/logos/warnerbros.png",
    description: "Leading producer of blockbuster films and TV shows.",
  },
  {
    id: 2,
    name: "Marvel Studios",
    logo: "/logos/marvel.png",
    description: "Creators of the Marvel Cinematic Universe (MCU).",
  },
  {
    id: 3,
    name: "Pixar",
    logo: "/logos/pixar.png",
    description: "Known for high-quality animated movies.",
  },
  {
    id: 4,
    name: "Netflix Studios",
    logo: "/logos/netflix.png",
    description: "Global leader in streaming and original content.",
  },
];

export default function CompanySection() {
  return (
    <section className="px-6 py-12 bg-neutral-950 text-white">
      <h2 className="text-2xl font-bold mb-8 text-center">
        Production Companies
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 place-items-center">
        {companies.map((company) => (
          <div
            key={company.id}
            className="bg-neutral-900 rounded-2xl shadow-md hover:shadow-lg hover:bg-neutral-800 transition p-4 w-full max-w-xs flex flex-col items-center text-center"
          >
            <img
              src={company.logo}
              alt={company.name}
              className="w-28 h-28 object-contain mb-4"
            />
            <h3 className="text-lg font-semibold">{company.name}</h3>
            <p className="text-sm text-neutral-400 mt-2">{company.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
