import { motion } from "motion/react";
import React from "react";

const steps = [
  {
    number: "1",
    title: "Discovery",
    description: "Understanding your concerns, goals and dreams",
    position: "top-left",
    delay: 0.2,
    align: "text-right"
  },
  {
    number: "2",
    title: "Analysis and Development",
    description: "Creating and assessing potential strategies",
    position: "top-right",
    delay: 0.4,
    align: "text-left"
  },
  {
    number: "3",
    title: "Decision making and implementation",
    description: "Of the investment plan",
    position: "bottom-right",
    delay: 0.6,
    align: "text-left"
  },
  {
    number: "4",
    title: "Staying on track",
    description: "Continued guidance with your goals",
    position: "bottom-left",
    delay: 0.8,
    align: "text-right"
  }
];

export default function ProcessDiagram() {
  return (
    <div className="relative w-full max-w-5xl mx-auto aspect-square flex items-center justify-center scale-90 md:scale-100">
      {/* Background Ring Graphics */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[85%] h-[85%] border border-white/5 rounded-full" />
        <div className="w-[65%] h-[65%] border border-white/10 rounded-full" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
          className="absolute w-[92%] h-[92%] border border-dashed border-accent/15 rounded-full"
        />
        {/* Subtle Glows */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-[100px]" />
      </div>

      {/* Central Hub */}
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, type: "spring", bounce: 0.4 }}
        viewport={{ once: true }}
        className="relative z-30 w-[32%] h-[32%] bg-secondary rounded-full flex items-center justify-center text-center p-4 md:p-10 shadow-[0_30px_100px_rgba(25,153,240,0.25)] border-4 border-accent group"
      >
        <div className="flex flex-col items-center">
          <h3 className="text-white font-bold text-[8px] sm:text-sm md:text-xl lg:text-2xl leading-tight uppercase tracking-tight">
            YOU ARE THE <span className="text-accent group-hover:animate-pulse">CENTER</span> OF OUR PROCESS
          </h3>
        </div>
        
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-accent rounded-full -z-10"
        />
      </motion.div>

      {/* Steps */}
      <div className="absolute inset-0">
        {steps.map((step, index) => {
          const isRight = step.position.includes("right");
          const isTop = step.position.includes("top");
          
          // Refined positions for better visual balance
          const positionStyles = {
            top: isTop ? "2%" : "auto",
            bottom: !isTop ? "2%" : "auto",
            left: !isRight ? "0" : "auto",
            right: isRight ? "0" : "auto",
            width: "48%",
            height: "45%"
          };

          return (
            <motion.div
              key={index}
              initial={{ 
                opacity: 0, 
                scale: 0.8,
                x: isRight ? 60 : -60, 
                y: isTop ? -60 : 60 
              }}
              whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
              transition={{ duration: 0.8, delay: step.delay, type: "spring" }}
              viewport={{ once: true }}
              className={`absolute flex flex-col justify-center p-4 sm:p-6 md:p-8
                ${isRight ? "items-start" : "items-end"}
              `}
              style={positionStyles}
            >
              <div className={`flex items-center gap-3 md:gap-6 mb-3 md:mb-5 ${isRight ? "flex-row" : "flex-row-reverse"}`}>
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-10 h-10 md:w-16 md:h-16 bg-accent text-white rounded-full flex items-center justify-center text-base md:text-3xl font-bold shadow-[0_10px_30px_rgba(25,153,240,0.3)] shrink-0 border-2 md:border-4 border-secondary"
                >
                  {step.number}
                </motion.div>
                <h4 className={`text-white font-bold text-sm sm:text-lg md:text-2xl lg:text-3xl leading-tight max-w-[140px] sm:max-w-[240px] ${step.align} tracking-tight`}>
                  {step.title}
                </h4>
              </div>
              <p className={`hidden md:block text-white/70 text-[10px] sm:text-sm md:text-base lg:text-lg leading-relaxed max-w-[160px] sm:max-w-[280px] ${step.align} font-medium`}>
                {step.description}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Connecting SVG Elements */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-accent" />
          </marker>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.25 }}
          transition={{ duration: 2.5, delay: 1, ease: "easeInOut" }}
          viewport={{ once: true }}
          d="M 50 18 A 32 32 0 0 1 82 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          className="text-accent"
          markerEnd="url(#arrowhead)"
          filter="url(#glow)"
        />
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.25 }}
          transition={{ duration: 2.5, delay: 1.5, ease: "easeInOut" }}
          viewport={{ once: true }}
          d="M 82 50 A 32 32 0 0 1 50 82"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          className="text-accent"
          markerEnd="url(#arrowhead)"
          filter="url(#glow)"
        />
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.25 }}
          transition={{ duration: 2.5, delay: 2, ease: "easeInOut" }}
          viewport={{ once: true }}
          d="M 50 82 A 32 32 0 0 1 18 50"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          className="text-accent"
          markerEnd="url(#arrowhead)"
          filter="url(#glow)"
        />
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.25 }}
          transition={{ duration: 2.5, delay: 2.5, ease: "easeInOut" }}
          viewport={{ once: true }}
          d="M 18 50 A 32 32 0 0 1 50 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
          className="text-accent"
          markerEnd="url(#arrowhead)"
          filter="url(#glow)"
        />
      </svg>
    </div>
  );
}
