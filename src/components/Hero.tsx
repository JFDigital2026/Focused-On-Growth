import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Button from "./Button";

interface HeroProps {
  onOpenContact: () => void;
}

function Counter({ value, duration = 2 }: { value: number; duration?: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [count, value, duration]);

  return <span>{displayValue}</span>;
}

export default function Hero({ onOpenContact }: HeroProps) {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-screen flex items-center pt-24 md:pt-32 overflow-hidden bg-primary">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 -skew-x-12 translate-x-1/4 z-0" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl z-0" 
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Content Wrapper */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col"
          >
            {/* Header & Subtext - Always on top of their respective columns */}
            <h1 className="mb-6 md:mb-8 text-4xl sm:text-5xl md:text-6xl lg:text-6xl leading-tight text-center lg:text-left">
              <span className="lg:whitespace-nowrap">Focused On <span className="text-accent relative inline animate-glow">Growth</span></span>
              <br />
              <span className="lg:whitespace-nowrap">Financial Group</span>
            </h1>
            <p className="text-secondary/70 mb-10 md:text-xl lg:text-lg md:mb-10 max-w-2xl md:max-w-3xl lg:max-w-lg text-base sm:text-lg leading-relaxed text-center lg:text-left mx-auto lg:mx-0">
              Most people were never taught how money actually works — and the financial industry is okay with that! We are not. We're a team of independent financial advisors who give everyday families complementary, personalized guidance so they can stop working for their money and start making it work for them!
            </p>

            {/* Mobile/Tablet Layout: Buttons + Stats next to Image */}
            <div className="grid grid-cols-2 gap-4 items-center lg:flex lg:flex-col lg:items-start lg:gap-10">
              {/* Buttons & Stats Column */}
              <div className="flex flex-col gap-6 order-1">
                <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                  <Button onClick={onOpenContact} className="text-xs md:text-base py-2.5 md:py-4 px-4 md:px-8">Contact</Button>
                  <Button variant="secondary" onClick={() => navigate('/services')} className="text-xs md:text-base py-2.5 md:py-4 px-4 md:px-8">Services</Button>
                </div>
                
                <div className="flex items-center gap-4 md:gap-6">
                  <div>
                    <div className="text-xl md:text-4xl lg:text-3xl font-bold">
                      <Counter value={20} />+
                    </div>
                    <div className="text-[9px] md:text-sm text-secondary/60 uppercase tracking-wider font-bold">Years Exp</div>
                  </div>
                  <div className="w-px h-8 md:h-12 lg:h-10 bg-secondary/20" />
                  <div>
                    <div className="text-xl md:text-4xl lg:text-3xl font-bold">
                      $<Counter value={200} />M
                    </div>
                    <div className="text-[9px] md:text-sm text-secondary/60 uppercase tracking-wider font-bold">AUM</div>
                  </div>
                </div>
              </div>

              {/* Image Column (Mobile/Tablet Only) */}
              <div className="lg:hidden order-2 relative">
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <img 
                    src="/images/hero-founders.jpg" 
                    alt="Focused On Growth Founders" 
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -left-2 w-full h-full border border-accent rounded-2xl -z-10" />
              </div>
            </div>
          </motion.div>

          {/* Right Image (Desktop Only) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="hidden lg:block relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="/images/hero-founders.jpg" 
                alt="Focused On Growth Founders" 
                className="w-full h-auto object-cover"
              />
            </div>
            {/* Decorative Frame */}
            <div className="absolute -bottom-6 -left-6 w-full h-full border-2 border-accent rounded-3xl -z-10" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-2xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
