import React from "react";
import { motion } from "motion/react";

const partners = [
  { name: "Franklin Templeton", url: "/images/partner-franklin-templeton.png" },
  { name: "Lincoln Financial", url: "/images/partner-lincoln-financial.png" },
  { name: "American Funds", url: "/images/partner-american-funds.png" },
  { name: "Fidelity", url: "/images/partner-fidelity.png" },
  { name: "AIG", url: "/images/partner-aig.png" },
  { name: "ClearBridge", url: "/images/partner-clearbridge.png" },
  { name: "Equitable", url: "/images/partner-equitable.png" },
  { name: "Brighthouse", url: "/images/partner-brighthouse.png" },
  { name: "Invesco", url: "/images/partner-invesco.png" },
  { name: "Genter", url: "/images/partner-genter.png" },
  { name: "AGF", url: "/images/partner-agf.png" },
  { name: "Dana Investment", url: "/images/partner-dana-investment.png" },
  { name: "Putnam", url: "/images/partner-putnam.png" }
];

const PartnerLogo = ({ partner }: { partner: typeof partners[0] }) => {
  return (
    <img
      src={partner.url}
      alt={partner.name}
      className="max-w-full max-h-full object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
    />
  );
};

export default function Partners() {
  return (
    <section className="py-20 bg-primary overflow-hidden border-y border-secondary/5">
      <div className="container mx-auto px-6 mb-12 text-center">
        <span className="text-secondary/40 font-bold uppercase tracking-[0.3em] text-[10px]">Trusted by Leading Partners</span>
      </div>
      
      <div className="relative flex overflow-x-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-24 items-center py-4"
        >
          {[...partners, ...partners].map((partner, index) => (
            <div 
              key={`${partner.name}-${index}`} 
              className="flex items-center justify-center w-56 h-14 px-6"
            >
              <PartnerLogo partner={partner} />
            </div>
          ))}
        </motion.div>
        
        {/* Gradient Fades for the edges */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-primary to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-primary to-transparent z-10" />
      </div>
    </section>
  );
}
