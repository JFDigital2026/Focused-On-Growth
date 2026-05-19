import React from "react";
import { motion } from "motion/react";

const partners = [
  { name: "Franklin Templeton", url: "https://drive.google.com/thumbnail?id=1Qsik5R2tlPaCn7cZDyXfCDCNchrfqg9V&sz=w1000" },
  { name: "Lincoln Financial", url: "https://drive.google.com/thumbnail?id=1RGANHgs73Mm8-FQS99xnk5xcRPCQnl-D&sz=w1000" },
  { name: "American Funds", url: "https://drive.google.com/thumbnail?id=1bQr2YrueChwb3MmidGLVL1CrSujA8IDT&sz=w1000" },
  { name: "Fidelity", url: "https://drive.google.com/thumbnail?id=1-3zM8a60-ZQvvk5Hp13cCE-a_BIeic7H&sz=w1000" },
  { name: "AIG", url: "https://drive.google.com/thumbnail?id=1g8HQdo5XbizLm1rM33SU9j4Ve0CMnu-C&sz=w1000" },
  { name: "ClearBridge", url: "https://drive.google.com/thumbnail?id=1lbR-RVKwLuUD5yALIwVYtl6v45uUBQdX&sz=w1000" },
  { name: "Equitable", url: "https://drive.google.com/thumbnail?id=1VhdKHLUL1iXFSSPa7HCl2rRvvcXZsU-m&sz=w1000" },
  { name: "Brighthouse", url: "https://drive.google.com/thumbnail?id=1ofhM5zvIFWLWsMVYDYmJtX8ewm0SYrVq&sz=w1000" },
  { name: "Invesco", url: "https://drive.google.com/thumbnail?id=1sBz-5BY7rgJ41XHoqrERls1YSkmYNS2H&sz=w1000" },
  { name: "Genter", url: "https://drive.google.com/thumbnail?id=1tCqfBVNzvwm4zw-nm7RB3f-2rxZfk2Vt&sz=w1000" },
  { name: "AGF", url: "https://drive.google.com/thumbnail?id=1ti2AVBHsP4KbJ6FwaJ2yxeCNWAjCcRUX&sz=w1000" },
  { name: "Dana Investment", url: "https://drive.google.com/thumbnail?id=1ya18DjpG19NEc50ad5cHS1b3IFluEPL3&sz=w1000" },
  { name: "Putnam", url: "https://drive.google.com/thumbnail?id=1zUl8By8xESL3pNa38b8tui4Nv4wfUKMl&sz=w1000" }
];

const PartnerLogo = ({ partner }: { partner: typeof partners[0] }) => {
  return (
    <img 
      src={partner.url} 
      alt={partner.name} 
      referrerPolicy="no-referrer"
      className="max-w-full max-h-full object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
      loading="lazy"
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
