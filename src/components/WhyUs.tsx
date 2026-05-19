import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

const reasons = [
  {
    title: "Education Over Sales",
    description: "We teach financial concepts in an easily understood way so you can feel confident in the decisions you make."
  },
  {
    title: "100% Partner-Funded",
    description: "We don't charge for our time. We are compensated through institutional partnerships, ensuring unbiased advice."
  },
  {
    title: "24/7/365 Monitoring",
    description: "Global Markets are constantly changing. If the markets are trading, our managing partners are monitoring their movement."
  },
  {
    title: "Tailored Strategies",
    description: "Every investor has their own personal goals. Your portfolio should reflect that."
  }
];

export default function WhyUs() {
  return (
    <section id="why-us" className="py-24 bg-secondary text-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-white mb-8">Why Focused On Growth?</h2>
            <p className="text-white/70 mb-12 text-xl hidden lg:block">
              Every plan we build is based entirely on your situation — your income, your family, your goals. Not a template. Not a computer-generated portfolio. A real strategy, built by a real person who took the time to understand your life.
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-6 hidden md:grid">
              {reasons.map((reason, index) => (
                <motion.div 
                  key={reason.title} 
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="mt-1">
                    <CheckCircle2 className="text-accent" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">{reason.title}</h4>
                    <p className="text-white/60 text-base hidden lg:block">{reason.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="relative flex items-center justify-center py-12 md:py-0">
            {/* Mobile Boxes - Only visible on small screens */}
            <div className="md:hidden absolute inset-0 z-20 pointer-events-none">
              <div className="absolute top-0 left-0 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-[10px] font-bold text-white shadow-xl">
                Education Over Sales
              </div>
              <div className="absolute top-0 right-0 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-[10px] font-bold text-white shadow-xl">
                100% Partner-Funded
              </div>
              <div className="absolute bottom-0 left-0 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-[10px] font-bold text-white shadow-xl">
                24/7/365 Monitoring
              </div>
              <div className="absolute bottom-0 right-0 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl text-[10px] font-bold text-white shadow-xl">
                Tailored Strategies
              </div>
            </div>

            {/* Expanding Circle Graphic */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative w-full max-w-[300px] md:max-w-[400px] lg:max-w-[500px] aspect-square"
            >
              {/* Main Radial Gradient Circle */}
              <div 
                className="absolute inset-0 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(25,153,240,0.3)]"
                style={{ 
                  background: "radial-gradient(circle, #191919 0%, #1999f0 100%)"
                }}
              >
                <div className="text-center z-10">
                  <span className="text-6xl font-bold mb-2 block">100%</span>
                  <span className="text-sm uppercase tracking-widest font-bold opacity-80">Client Focused</span>
                </div>
              </div>

              {/* Outer Expanding Rings */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1.1, opacity: 0.3 }}
                transition={{ duration: 1.5, delay: 0.2 }}
                className="absolute inset-0 border-2 border-accent rounded-full"
              />
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1.2, opacity: 0.15 }}
                transition={{ duration: 1.5, delay: 0.4 }}
                className="absolute inset-0 border border-accent rounded-full"
              />

              {/* Expanding Lines */}
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "120%" }}
                transition={{ duration: 1, delay: 0.6 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent z-0"
              />
              <motion.div 
                initial={{ height: 0 }}
                whileInView={{ height: "120%" }}
                transition={{ duration: 1, delay: 0.8 }}
                className="absolute top-1/2 left-1/2 -translate-y-1/2 w-px bg-gradient-to-b from-transparent via-accent/50 to-transparent z-0"
              />
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
