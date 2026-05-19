import { motion, useScroll, useTransform, useSpring, MotionValue, useMotionValue } from "motion/react";
import { Shield, FileText, Landmark, CreditCard, TrendingUp } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";

const houseLevels = [
  {
    id: 1,
    title: "Protect Your Income",
    subtitle: "The foundation: Life, Disability, and Health insurance",
    icon: <Shield size={24} />,
    color: "bg-[#1999f0]",
    type: "foundation"
  },
  {
    id: 2,
    title: "Will, Living Will, POA",
    subtitle: "Estate planning and legal protection for your legacy",
    icon: <FileText size={24} />,
    color: "bg-[#1999f0]",
    type: "block"
  },
  {
    id: 3,
    title: "Emergency Fund",
    subtitle: "3-6 months of liquid cash for life's surprises",
    icon: <Landmark size={24} />,
    color: "bg-[#1999f0]",
    type: "block"
  },
  {
    id: 4,
    title: "Debt Reduction",
    subtitle: "Strategic elimination of high-interest liabilities",
    icon: <CreditCard size={24} />,
    color: "bg-[#1999f0]",
    type: "block"
  },
  {
    id: 5,
    title: "Investments",
    subtitle: "Retirement Planning (IRA, Roth IRA, 401k, 403b), College Planning, Saving for a house",
    icon: <TrendingUp size={24} />,
    color: "bg-[#1999f0]",
    type: "roof"
  }
];

interface LevelData {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  type: string;
}

interface LevelProps {
  level: LevelData;
  index: number;
  scrollYProgress: MotionValue<number>;
}

const HouseLevel: React.FC<LevelProps> = ({ level, index, scrollYProgress }) => {
  const isFoundation = level.type === "foundation";
  
  // Accelerate animation: finish all 5 levels by 0.5 progress
  const start = isFoundation ? 0 : (index * 0.1);
  const end = start + 0.1;
  
  const opacity = useTransform(scrollYProgress, [start, end], [isFoundation ? 1 : 0, 1]);
  const scrollScale = useTransform(scrollYProgress, [start, end], [isFoundation ? 1 : 0.8, 1]);
  
  // Animate height to push elements down
  const targetHeight = level.type === "roof" ? 120 : 80;
  const height = useTransform(scrollYProgress, [start, end], [isFoundation ? targetHeight : 0, targetHeight]);
  const marginBottom = useTransform(scrollYProgress, [start, end], [isFoundation ? 8 : 0, 8]);

  // Hover state for the "pop" effect
  const [isHovered, setIsHovered] = useState(false);
  const hoverValue = useMotionValue(1);
  
  // Combine scroll scale and hover scale
  // We use useSpring for the hover transition to make it smooth
  const springHoverScale = useSpring(hoverValue, { stiffness: 400, damping: 25 });

  useEffect(() => {
    hoverValue.set(isHovered ? 1.1 : 1);
  }, [isHovered, hoverValue]);

  const combinedScale = useTransform(
    [scrollScale, springHoverScale], 
    (values: number[]) => values[0] * values[1]
  );

  if (level.type === "roof") {
    return (
      <motion.div
        style={{ 
          opacity, 
          scale: combinedScale, 
          height, 
          marginBottom, 
          width: "540px",
          zIndex: isHovered ? 100 : 50
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative flex flex-col items-center cursor-pointer transition-shadow duration-300"
      >
        <div className="relative w-full h-[120px] shrink-0">
          <svg 
            viewBox="0 0 540 120" 
            className={`w-full h-full transition-filter duration-300 ${isHovered ? 'drop-shadow-2xl' : 'drop-shadow-xl'}`}
            preserveAspectRatio="none"
          >
            <path 
              d="M270 0 L540 120 L0 120 Z" 
              fill="#1999f0" 
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 text-white text-center px-4">
            <div className="flex justify-center mb-1"><TrendingUp size={20} /></div>
            <h3 className="text-xl font-bold mb-0.5">{level.id}. {level.title}</h3>
            <p className="text-[9px] font-medium opacity-95 max-w-[320px] mx-auto leading-tight">
              {level.subtitle}
            </p>
          </div>

          <div className="absolute right-[100px] top-[10px] w-8 h-16 bg-[#1580ca] -z-10" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{ 
        opacity, 
        scale: combinedScale, 
        height,
        marginBottom,
        width: level.type === "foundation" ? "500px" : "460px",
        zIndex: isHovered ? 100 : 10 + level.id,
        boxShadow: isHovered ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" : "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`max-w-full ${level.color} rounded-xl px-5 border border-white/10 flex items-center gap-5 group cursor-pointer overflow-hidden shrink-0 transition-shadow duration-300`}
    >
      <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
        {level.icon}
      </div>
      <div className="text-white text-left">
        <h3 className="text-lg font-bold leading-tight">{level.id}. {level.title}</h3>
        <p className="text-[10px] opacity-90 font-medium leading-tight">{level.subtitle}</p>
      </div>
    </motion.div>
  );
}

export default function Stages() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rawScrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "end 0.1"]
  });

  const scrollYProgress = useSpring(rawScrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="stages" className="py-20 bg-primary overflow-hidden min-h-[100vh] relative" ref={containerRef}>
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="mb-4 text-secondary">Financial Planning For Every Stage In Life</h2>
          <p className="text-secondary/60 max-w-2xl mx-auto">
            Build your financial future on a solid foundation. Like a house, a strong plan starts from the ground up.
          </p>
        </motion.div>

        {/* The House Container - Flex direction column-reverse to stack from bottom up */}
        <div className="max-w-4xl mx-auto relative flex flex-col-reverse items-center">
          {houseLevels.map((level, index) => (
            <HouseLevel 
              key={level.id} 
              level={level} 
              index={index} 
              scrollYProgress={scrollYProgress} 
            />
          ))}
        </div>

        {/* Ground Line */}
        <motion.div 
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 1 }}
          className="w-full max-w-5xl mx-auto h-1 bg-secondary/10 mt-8 rounded-full" 
        />
      </div>
    </section>
  );
}
