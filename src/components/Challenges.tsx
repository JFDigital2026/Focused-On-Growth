import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { AlertCircle, Zap, HeartPulse, ShieldAlert } from "lucide-react";
import React, { useState, useRef } from "react";

const challenges = [
  {
    icon: <AlertCircle className="text-[#263abd]" size={24} />,
    title: "Financial Illiteracy",
    points: ["Lack of understanding", "Confusion about investment options", "Investment uncertainty"]
  },
  {
    icon: <Zap className="text-[#263abd]" size={24} />,
    title: "Lost Opportunities",
    points: ["Analysis Paralysis", "Missed investment opportunity", "Inadequate planning"]
  },
  {
    icon: <HeartPulse className="text-[#263abd]" size={24} />,
    title: "Financial Stress",
    points: ["Loss Aversion", "Marital strain", "Financial complexity"]
  },
  {
    icon: <ShieldAlert className="text-[#263abd]" size={24} />,
    title: "Lack of Guidance",
    points: ["Generic advice", "Inaccessible advisors", "Transactional service"]
  }
];

interface ChallengeCardProps {
  item: typeof challenges[0];
  index: number;
  scrollDir: "up" | "down";
  key?: string | number;
}

function ChallengeCard({ item, index, scrollDir }: ChallengeCardProps) {
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
      className="relative group rounded-2xl p-4 md:p-8 overflow-hidden min-h-[200px] md:min-h-[300px] flex flex-col items-center text-center"
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
        <div className="mb-4 md:mb-8 h-12 w-12 md:h-20 md:w-20 rounded-xl md:rounded-2xl border border-white/20 bg-gradient-to-br from-accent/20 to-white/10 flex items-center justify-center shadow-inner">
          {item.icon && React.cloneElement(item.icon as React.ReactElement, { size: 24, className: "text-accent md:w-10 md:h-10" })}
        </div>
        <h4 className="font-bold text-sm md:text-xl mb-3 md:mb-6 text-secondary">{item.title}</h4>
        <ul className="space-y-2 md:space-y-3 w-full">
          {item.points.map((point) => (
            <li key={point} className="text-secondary/60 text-[9px] md:text-sm flex items-center justify-center gap-2 md:gap-3">
              <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-accent rounded-full shadow-[0_0_8px_rgba(25,153,240,0.5)]" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function Challenges() {
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
    <section id="challenges" className="py-24 bg-primary">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 text-secondary">Financial Challenges We Solve</h2>
          <p className="text-secondary/60 max-w-2xl mx-auto">
            We address the root causes of financial anxiety to bring you peace of mind and clarity.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {challenges.map((item, index) => (
            <ChallengeCard key={item.title} item={item} index={index} scrollDir={scrollDir} />
          ))}
        </div>
      </div>
    </section>
  );
}
