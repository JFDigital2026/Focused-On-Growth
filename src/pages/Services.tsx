import React from "react";
import { motion } from "motion/react";
import { 
  TrendingUp, 
  ShieldCheck, 
  PiggyBank, 
  GraduationCap, 
  Briefcase, 
  HeartHandshake,
  ArrowRight
} from "lucide-react";
import Button from "../components/Button";
import ProcessDiagram from "../components/ProcessDiagram";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="group relative p-4 md:p-8 bg-white rounded-2xl md:rounded-[2rem] border border-[#191919]/5 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-accent/30 transition-all duration-500 overflow-hidden"
    >
      {/* Background Accent */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-500" />
      
      <div className="relative z-10">
        <div className="w-10 h-10 md:w-16 md:h-16 bg-accent/10 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-8 group-hover:bg-accent group-hover:text-white transition-all duration-500 text-accent group-hover:rotate-6 group-hover:scale-110">
          {React.cloneElement(icon as React.ReactElement, { size: 20, className: "md:w-7 md:h-7" })}
        </div>
        <h3 className="text-xs md:text-2xl font-bold text-[#191919] mb-2 md:mb-4 group-hover:text-accent transition-colors duration-300">{title}</h3>
        <p className="hidden md:block text-[#191919]/60 leading-relaxed mb-8 text-sm md:text-base">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

export default function Services({ onOpenContact }: { onOpenContact: () => void }) {
  const services = [
    {
      title: "Investment Management",
      description: "Customized portfolio strategies designed to grow and protect your wealth based on your risk tolerance and long-term objectives.",
      icon: <TrendingUp size={28} />,
      delay: 0.1
    },
    {
      title: "Retirement Planning",
      description: "Strategic planning to ensure you have the income and security needed to enjoy your retirement years with confidence.",
      icon: <PiggyBank size={28} />,
      delay: 0.2
    },
    {
      title: "Risk Management",
      description: "Comprehensive insurance and protection strategies to safeguard your family and business against life's uncertainties.",
      icon: <ShieldCheck size={28} />,
      delay: 0.3
    },
    {
      title: "Education Planning",
      description: "Dedicated strategies to help you save for your children's or grandchildren's education while maintaining your financial balance.",
      icon: <GraduationCap size={28} />,
      delay: 0.4
    },
    {
      title: "Business Solutions",
      description: "Tailored financial advice for business owners, from succession planning to employee benefits and cash flow management.",
      icon: <Briefcase size={28} />,
      delay: 0.5
    },
    {
      title: "Legacy Planning",
      description: "Thoughtful estate and legacy strategies to ensure your assets are distributed according to your wishes and values.",
      icon: <HeartHandshake size={28} />,
      delay: 0.6
    }
  ];

  return (
    <div className="pt-20 relative">
      {/* Hero Section */}
      <section className="relative bg-white py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: `linear-gradient(#191919 1px, transparent 1px), linear-gradient(90deg, #191919 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} 
        />
        
        {/* Animated Background Blobs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -right-20 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 -left-20 w-[30rem] h-[30rem] bg-accent/5 rounded-full blur-[120px] pointer-events-none"
        />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-[#191919] text-4xl md:text-6xl lg:text-7xl font-bold mb-8 max-w-5xl mx-auto leading-[1.1]">
              Comprehensive <span className="underline decoration-accent decoration-4 underline-offset-8">Financial Services</span> Tailored to <span className="underline decoration-accent decoration-4 underline-offset-8">Your Journey</span>
            </h1>
            
            <p className="text-[#191919]/60 text-lg md:text-xl max-w-3xl mx-auto mb-12">
              We provide a wide range of financial solutions designed to help you navigate every stage of your financial life with clarity and confidence.
            </p>

            <div className="flex items-center justify-center">
              <Button onClick={onOpenContact} showIcon={false} className="px-10 py-4">
                Schedule a Consultation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-[#F1F3F6]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-secondary overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-white mb-6"
            >
              Our <span className="text-accent">Process</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-white text-lg max-w-2xl mx-auto"
            >
              A systematic approach to wealth management that puts your goals at the center of everything we do.
            </motion.p>
          </div>

          <ProcessDiagram />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 -skew-x-12 translate-x-1/3" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto bg-secondary rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent/20 to-transparent pointer-events-none" />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to build your financial future?</h2>
              <p className="text-white/70 text-lg mb-12 max-w-2xl mx-auto">
                Our team is here to guide you through the complexities of wealth management and help you achieve the freedom you deserve.
              </p>
              <Button 
                onClick={onOpenContact} 
                className="bg-white text-secondary border-white hover:bg-white/90"
              >
                Get Started Today
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
