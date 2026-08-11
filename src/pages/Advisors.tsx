import React from "react";
import { motion } from "motion/react";
import Button from "../components/Button";

interface AdvisorProps {
  name: string;
  title: string;
  bio: string[];
  image: string;
  laptopImage: string;
  isReversed?: boolean;
  onOpenContact: (advisor?: string) => void;
}

const AdvisorSection: React.FC<AdvisorProps> = ({ name, title, bio, image, laptopImage, isReversed, onOpenContact }) => {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden py-12 md:py-24">
      {/* Background Image - Hidden on mobile */}
      <div className="absolute inset-0 z-0 hidden md:block">
        {/* Tablet Background */}
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover grayscale opacity-20 lg:hidden"
        />
        {/* Laptop Background */}
        <img 
          src={laptopImage} 
          alt={name} 
          className="hidden lg:block w-full h-full object-cover grayscale opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary via-primary/40 to-primary lg:hidden" />
        <div className={`absolute inset-0 hidden lg:block bg-gradient-to-r ${isReversed ? 'from-transparent via-primary/20 to-primary' : 'from-primary via-primary/20 to-transparent'}`} />
      </div>

      {/* Mobile Background */}
      <div className="absolute inset-0 z-0 md:hidden bg-secondary" />

      <div className="container mx-auto px-6 relative z-10">
        <div className={`flex flex-col md:flex-row ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-24`}>
          <motion.div 
            initial={{ opacity: 0, x: isReversed ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={`w-full md:w-1/2 p-8 md:p-12 rounded-3xl backdrop-blur-md border border-white/10 ${isReversed ? 'bg-secondary/80 text-white' : 'bg-white/80 text-secondary'}`}
          >
            {/* Mobile Circular Image */}
            <div className="md:hidden flex justify-center mb-8">
              <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-accent/30 shadow-2xl">
                <img 
                  src={image} 
                  alt={name} 
                  className="w-full h-full object-cover grayscale"
                />
              </div>
            </div>

            <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${isReversed ? 'text-white' : 'text-secondary'}`}>{name}</h2>
            <h3 className={`text-lg md:text-xl font-semibold mb-6 ${isReversed ? 'text-accent' : 'text-accent'}`}>{title}</h3>
            
            <div className="space-y-4 mb-8">
              {bio.map((paragraph, idx) => (
                <p key={idx} className={`text-sm leading-relaxed ${isReversed ? 'text-white/80' : 'text-secondary/80'}`}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex justify-center md:justify-start">
              <Button
                onClick={() => onOpenContact(name)}
                variant={isReversed ? "primary" : "secondary"}
                className={`${isReversed ? "" : "border-secondary text-secondary hover:bg-secondary hover:text-white"} w-full md:w-auto`}
              >
                <div className="text-center">
                  <span className="block font-bold">REQUEST AN APPOINTMENT</span>
                  <span className="hidden md:block text-[10px] opacity-60">Take the next step toward financial confidence</span>
                </div>
              </Button>
            </div>
          </motion.div>

          {/* Tablet/Desktop Circular Image */}
          <div className="hidden md:flex lg:hidden md:w-1/2 justify-center items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="w-64 h-64 lg:w-96 lg:h-96 rounded-full overflow-hidden border-8 border-white/10 shadow-[0_0_50px_rgba(25,153,240,0.3)] relative group"
            >
              <img 
                src={image} 
                alt={name} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-accent/10 group-hover:bg-transparent transition-colors duration-700" />
            </motion.div>
          </div>
          <div className="hidden lg:block w-1/2" />
        </div>
      </div>
    </section>
  );
};

export default function Advisors({ onOpenContact }: { onOpenContact: (advisor?: string) => void }) {
  const advisors = [
    {
      name: "David Schimpf",
      title: "Investment Advisor Representative",
      bio: [
        "David started in the financial services industry in 2005. With over two decades of experience, he brings a unique perspective and expertise to managing money through various marketing environments. Specializing in retirement planning, employer sponsored plans, and portfolio analysis and construction, Dave personally manages over 100 million in assets. He holds a series 6, 63, 65 and 26 investment license, as well as an MLO, life insurance, and personal lines license."
      ],
      image: "/images/advisor-david-schimpf.png",
      laptopImage: "/images/advisor-david-schimpf-laptop.png"
    },
    {
      name: "Kiley Haws",
      title: "Investment Advisor Representative",
      bio: [
        "Hi my name is Kiley Haws",
        "After graduating from Pennsbury High School, I began studying sonography at Bucks County Community College, never expecting my path would lead me into finance. After connecting with Dave Schimpf and working alongside him as his assistant, I gained firsthand insight into the financial industry and the challenges everyday families face. What started as a support role quickly became a calling. Seeing how confusing and overwhelming financial planning can feel inspired me to transition into personal finance with the goal of doing things differently.",
        "Today, at Focused on Growth Financial Group, I’m passionate about helping individuals and families build wealth with clarity, confidence, and long-term strategy. I strive to build lasting relationships with my clients and serve as a trusted partner through every stage of life and every financial milestone."
      ],
      image: "/images/advisor-kiley-haws.png",
      laptopImage: "/images/advisor-kiley-haws-laptop.png",
      isReversed: true
    },
    {
      name: "Jace Freeman",
      title: "Investment Advisor Representative",
      bio: [
        "Growing up in a household where money was tight, I learned early on what it meant to live modestly. In high school, I watched friends day trade, making what seemed like easy money. Curious and eager, I tried it myself — and quickly lost everything I put in. That experience opened my eyes to the lack of financial education in the school system.",
        "Soon after, I was introduced to Focused On Growth Financial Group, where I discovered a completely different approach — one centered on education. I realized that most people aren’t lacking ambition; they’re lacking financial knowledge. Over the past four years, I’ve made it my mission to help individuals understand how money works and create a clear path toward their goals and dreams. When someone leaves a conversation feeling empowered, informed, and confident about their future, that’s what makes it all worth it."
      ],
      image: "/images/advisor-jace-freeman.png",
      laptopImage: "/images/advisor-jace-freeman-laptop.png"
    },
    {
      name: "Liana Jones",
      title: "Investment Advisor Representative",
      bio: [
        "Liana graduated in 2024 from Penn State University with a degree in Finance, where she also competed as a four-year Division I softball player. Liana currently holds her life insurance license and is actively working toward completing her securities licensing exams.",
        "She is passionate about building meaningful relationships and is committed to helping her clients feel confident and informed in their financial decisions. Dedicated, hardworking, and driven to continuously grow, Liana strives to provide thoughtful guidance and dependable support to every client she serves."
      ],
      image: "/images/advisor-liana-jones.png",
      laptopImage: "/images/advisor-liana-jones-laptop.png",
      isReversed: true
    },
    {
      name: "Rochelle Beck",
      title: "Investment Advisor Representative",
      bio: [
        "Rochelle Beck is an investment advisor based in Sullivan County, NY, licensed in New York, Pennsylvania, New Jersey, and California. Holding Series 6, 63, and 65 registrations along with life and annuity licenses, she helps young families, new investors, retirees, and small business owners build practical financial plans focused on long-term stability and growth.",
        "As a farmer, Rochelle brings a unique understanding of protecting family land, planning ahead, and preserving generational wealth. She focuses on clear, educational guidance—helping clients understand the importance of starting early, using TERM life insurance to protect what they’re building, investing through tools like Roth IRAs, and helping small businesses establish retirement plans that benefit both the company and its employees."
      ],
      image: "/images/advisor-rochelle-beck.png",
      laptopImage: "/images/advisor-rochelle-beck-laptop.png"
    },
    {
      name: "Val Ozer",
      title: "Regional Manager / Financial Advisor",
      bio: [
        "Val Ozer (Registered Name: Valerie Susan Ozer) is a Regional Manager and Financial Advisor holding Series 6, 63, and 65 licenses, along with PMP, CPCU, and AFSB certifications. She earned a B.S. in Chemistry from the University of Connecticut — where she affiliated with the American Chemical Honor Society — and a Master's in Accounting and Business Administration from the University of New Haven with high honors. Comfortable with numbers and analysis, Val began her career in scientific research before transitioning to financial services after seeing the potential for more direct, individual impact. She then spent years as a surety executive in corporate environments, evaluating hundreds of construction companies and service businesses of all sizes — gaining deep insight into the real challenges faced by business owners every day.",
        "With over 20 years in financial services, Val specializes in helping businesses and families build customized strategies aligned with their individual goals, whether creating financial freedom now, planning for retirement, or establishing a lasting legacy for loved ones. Her approach is rooted in listening first and always acting in the client's best interest — guiding each person through education and tailored financial solutions that truly fit their life."
      ],
      image: "/images/advisor-val-ozer.png",
      laptopImage: "/images/advisor-val-ozer-laptop.png",
      isReversed: true
    }
  ];

  return (
    <div className="pt-20 relative">
      {/* Modern Header Section */}
      <div className="relative bg-white py-16 md:py-20 overflow-hidden">
        {/* Grid Background Pattern */}
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
              We've got an <span className="underline decoration-accent decoration-4 underline-offset-8">entire</span> team dedicated to helping <span className="underline decoration-accent decoration-4 underline-offset-8">you</span> meet <span className="underline decoration-accent decoration-4 underline-offset-8">your goals</span>
            </h1>
            
            <p className="text-[#191919]/60 text-lg md:text-xl max-w-3xl mx-auto mb-12">
              At Focused On Growth Financial Group we work with you to determine the method of investing most appropriate to meet your goals based on your unique circumstances and personal objectives.
            </p>

            <div className="flex items-center justify-center">
              <Button onClick={() => onOpenContact()} showIcon={false} className="px-10 py-4">
                Get in touch
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {advisors.map((advisor, index) => (
        <AdvisorSection 
          key={index} 
          {...advisor} 
          onOpenContact={onOpenContact} 
        />
      ))}
    </div>
  );
}
