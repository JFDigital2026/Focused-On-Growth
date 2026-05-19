import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { CheckCircle2, TrendingUp, Heart, Clock, ArrowRight } from "lucide-react";
import Button from "../components/Button";

interface CareerPointProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}

const CareerPoint: React.FC<CareerPointProps> = ({ title, description, icon, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className={`flex flex-col md:flex-row items-center gap-8 mb-32 relative z-10 group ${
        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="relative w-full">
          <div className="absolute -inset-4 bg-accent/10 rounded-[2.5rem] blur-2xl group-hover:bg-accent/20 transition-all duration-500 opacity-0 group-hover:opacity-100" />
          <div className="relative bg-secondary/80 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl transition-all duration-500 group-hover:border-accent/50 group-hover:shadow-[0_20px_50px_rgba(25,153,240,0.15)]">
            <div className="text-accent mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
              {icon}
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-3 group-hover:text-accent transition-colors duration-300">
              <CheckCircle2 className="w-6 h-6 text-accent" />
              {title}
            </h3>
            <p className="text-white/70 text-lg leading-relaxed group-hover:text-white/90 transition-colors duration-300">
              {description}
            </p>
          </div>
        </div>
      </div>
      <div className="hidden md:block w-1/2" />
    </motion.div>
  );
};

export default function Careers({ onOpenContact }: { onOpenContact: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const glowOpacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  const careerPoints = [
    {
      title: "Unlimited Earning Potential",
      description: "Your income is based on effort, not a salary cap. We provide a platform where your hard work directly translates to financial rewards.",
      icon: <TrendingUp className="w-14 h-14" />
    },
    {
      title: "Flexibility & Freedom",
      description: "Set your own schedule and build a business that fits your life. Enjoy the option to work remotely from home and balance your professional and personal life.",
      icon: <Clock className="w-14 h-14" />
    },
    {
      title: "Make a Real Impact",
      description: "Help families and individuals take control of their financial future. Provide the education and tools they need to achieve peace of mind.",
      icon: <Heart className="w-14 h-14" />
    },
    {
      title: "Booming Industry Growth",
      description: "The demand for financial education and services is skyrocketing. Join a sector that remains resilient and essential in any economic climate.",
      icon: <ArrowRight className="w-14 h-14" />
    }
  ];

  return (
    <div className="bg-primary min-h-screen pt-20 overflow-hidden relative">
      {/* Hero Section */}
      <div className="relative bg-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(#191919 1px, transparent 1px), linear-gradient(90deg, #191919 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} 
        />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-[#191919] text-4xl md:text-6xl lg:text-7xl font-bold mb-8 max-w-5xl mx-auto leading-[1.1]">
              The Opportunity <span className="underline decoration-accent decoration-4 underline-offset-8">You've Been</span> Looking For
            </h1>
            
            <p className="text-[#191919]/60 text-lg md:text-xl max-w-3xl mx-auto mb-12">
              At Focused On Growth Financial Group, we help ambitious individuals build their own businesses in the booming financial services industry. No finance degree? No problem. We provide the training, support, and tools you need to create success on your terms.
            </p>

            <div className="flex items-center justify-center">
              <Button onClick={onOpenContact} showIcon={false} className="px-10 py-4">
                Join Our Team
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* GPS Navigation Section */}
      <div ref={containerRef} className="relative container mx-auto px-6 py-24">
        {/* The "GPS" Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 md:w-1.5 -translate-x-1/2">
          {/* Background Line */}
          <div className="absolute inset-0 bg-white/10 rounded-full" />
          
          {/* Animated Glowing Line */}
          <motion.div 
            className="absolute top-0 left-0 right-0 bg-accent rounded-full"
            style={{ 
              height: "100%",
              scaleY: pathLength,
              originY: 0,
              opacity: glowOpacity,
              boxShadow: `0 0 20px rgba(25,153,240,0.8), 0 0 40px rgba(25,153,240,0.4)`
            }}
          />
          
          {/* Glowing "GPS" Pointer */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-6 h-6 md:w-8 md:h-8 bg-accent rounded-full z-20 flex items-center justify-center"
            style={{
              top: useTransform(pathLength, [0, 1], ["0%", "100%"]),
              boxShadow: "0 0 20px #1999f0, 0 0 40px #1999f0, 0 0 60px rgba(25,153,240,0.5)",
              scale: glowScale
            }}
          >
            <div className="w-2 h-2 md:w-3 md:h-3 bg-white rounded-full animate-pulse" />
            <div className="absolute inset-0 animate-ping bg-accent rounded-full opacity-50" />
          </motion.div>
        </div>

        {/* Career Points */}
        <div className="space-y-24 md:space-y-0">
          {careerPoints.map((point, index) => (
            <CareerPoint 
              key={index}
              index={index}
              {...point}
            />
          ))}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-32 relative z-10"
        >
          <div className="inline-block p-12 rounded-3xl bg-secondary/50 backdrop-blur-xl border border-white/10 max-w-2xl">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
            <p className="text-white/70 mb-8 text-lg">
              Take the first step toward building your own business and creating the life you've always wanted.
            </p>
            <Button onClick={onOpenContact} className="w-full md:w-auto px-12 py-4">
              Apply Now
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
