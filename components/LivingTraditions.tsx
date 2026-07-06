"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import SectionHeader from "./SectionHeader";

const traditions = [
  { id: 1, name: "Ngondo Festival", image: "/Festivals/Ngondo.png" },
  { id: 2, name: "Cooking Methods", image: "/Food/Achu.jpg" },
  { id: 3, name: "Clothing Heritage", image: "/clothing/clothe_designs.png" },
  { id: 4, name: "Textile Arts", image: "/clothing/Toghu.png" },
];

export default function LivingTraditions() {
  return (
    <section className="py-20 bg-[#0B0E14] scroll-mt-20" id="living-traditions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Living Traditions"
          subtitle="Witness customs and practices that are still vibrant today."
        />

        <div className="flex flex-wrap justify-center gap-10 md:gap-20">
          {traditions.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-800 group-hover:border-red-600 transition-colors shadow-lg">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h4 className="mt-4 text-white font-medium text-lg text-center group-hover:text-red-500 transition-colors">
                {item.name}
              </h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
