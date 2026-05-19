import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { Search, Target, Map, Headphones } from "lucide-react";
import React, { useState, useRef } from "react";

const steps = [
  {
    number: "01",
    icon: <Search size={24} />,
    title: "Analyze Finances",
    description: "We perform a deep dive into your current financial position and gauge your understanding of the market."
  },
  {
    number: "02",
    icon: <Target size={24} />,
    title: "Identify Goals",
    description: "We help you define your personal definition of success including short and long-term goals."
  },
  {
    number: "03",
    icon: <Map size={24} />,
    title: "Build Your Plan",
    description: "We develop a tailored strategic game plan with the 'why' behind every move."
  },
  {
    number: "04",
    icon: <Headphones size={24} />,
    title: "Ongoing Support",
    description: "While most financial advisors work a limited schedule, our team makes themselves available outside of the standard 9-5 window."
  }
];

interface ProcessCardProps {
  step: typeof steps[0];
  index: number;
  scrollDir: "up" | "down";
  key?: string | number;
}

function ProcessCard({ step, index, scrollDir }: ProcessCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: scrollDir === "down" ? 50 : -50 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05, y: -10 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        y: { type: "spring", stiffness: 300, damping: 20 }
      }}
      viewport={{ once: false, margin: "-100px" }}
      className="relative group rounded-2xl p-4 md:p-10 overflow-hidden h-full flex flex-col items-center text-center"
      style={{ 
        backgroundColor: "#d2d6df",
        boxShadow: "0px 10px 30px rgba(0,0,0,0.05)"
      }}
    >
      {/* Animated Border */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-20 bg-gradient-to-r from-transparent via-accent to-transparent"
          style={{ animation: "rotate 4s linear infinite" }}
        />
      </div>
      
      {/* Inner Mask */}
      <div className="absolute inset-[2px] bg-[#d2d6df] rounded-[14px] z-1" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="text-accent font-bold text-sm md:text-lg mb-3 md:mb-6">{step.number}.</div>
        <div className="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-accent/20 to-white/10 rounded-xl md:rounded-2xl flex items-center justify-center text-accent mb-4 md:mb-8 border border-white/10 group-hover:border-accent transition-colors duration-300 shadow-inner">
          {step.icon && React.cloneElement(step.icon as React.ReactElement, { size: 24, className: "md:w-10 md:h-10" })}
        </div>
        <h3 className="text-sm md:text-2xl font-bold mb-2 md:mb-4 text-secondary">{step.title}</h3>
        <p className="text-secondary/60 text-[10px] md:text-base leading-relaxed">
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Process() {
  const { scrollY } = useScroll();
  const [scrollDir, setScrollDir] = useState<"up" | "down">("down");
  const lastScrollY = useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > lastScrollY.current) {
      setScrollDir("down");
    } else {
      setScrollDir("up");
    }
    lastScrollY.current = latest;
  });

  return (
    <section id="process" className="py-24 bg-primary">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-accent font-bold uppercase tracking-widest text-sm mb-4 block">4 Simple Steps</span>
          <h2 className="mb-4 text-secondary">Our Process</h2>
          <p className="text-secondary/60 max-w-2xl mx-auto">
            A visual, guided approach to transforming your financial future.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {steps.map((step, index) => (
            <ProcessCard key={step.number} step={step} index={index} scrollDir={scrollDir} />
          ))}
        </div>
      </div>
    </section>
  );
}


